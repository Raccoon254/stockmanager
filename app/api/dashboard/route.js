import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const [
      totalInventoryValue,
      todaySales,
      todaySalesCount,
      lowStockItems,
      topSellingItems,
      recentSales,
      totalItems,
      totalSalesThisMonth
    ] = await Promise.all([
      prisma.item.aggregate({
        where: { isActive: true },
        _sum: {
          stockQuantity: true,
        },
      }).then(async (result) => {
        const items = await prisma.item.findMany({
          where: { isActive: true },
          select: { stockQuantity: true, sellingPrice: true },
        })
        return items.reduce((total, item) => 
          total + (item.stockQuantity * parseFloat(item.sellingPrice)), 0
        )
      }),

      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          total: true,
        },
      }),

      prisma.sale.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      prisma.item.count({
        where: {
          isActive: true,
          stockQuantity: {
            lte: prisma.item.fields.minStockLevel,
          },
        },
      }),

      prisma.saleItem.groupBy({
        by: ['itemId'],
        where: {
          sale: {
            createdAt: {
              gte: weekAgo,
            },
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }).then(async (results) => {
        const itemIds = results.map(r => r.itemId)
        const items = await prisma.item.findMany({
          where: { id: { in: itemIds } },
        })
        
        return results.map(result => {
          const item = items.find(i => i.id === result.itemId)
          return {
            id: result.itemId,
            name: item?.name || 'Unknown',
            quantitySold: result._sum.quantity,
          }
        })
      }),

      prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          saleItems: {
            include: {
              item: {
                select: { name: true },
              },
            },
          },
        },
      }),

      prisma.item.count({
        where: { isActive: true },
      }),

      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: monthAgo,
          },
        },
        _sum: {
          total: true,
        },
      }),
    ])

    const stats = {
      totalInventoryValue: totalInventoryValue || 0,
      todaySales: todaySales._sum.total || 0,
      todaySalesCount,
      lowStockItemsCount: lowStockItems,
      totalItems,
      totalSalesThisMonth: totalSalesThisMonth._sum.total || 0,
      topSellingItems,
      recentSales: recentSales.map(sale => ({
        id: sale.id,
        customerName: sale.customerName,
        total: sale.total,
        createdAt: sale.createdAt,
        itemCount: sale.saleItems.length,
        items: sale.saleItems.map(si => si.item.name).join(', '),
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}