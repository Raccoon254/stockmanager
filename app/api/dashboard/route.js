import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    
    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 })
    }

    // Verify user has access to this shop
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        ownerId: session.user.id
      }
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found or access denied' }, { status: 403 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const yearAgo = new Date()
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)

    const [
      totalInventoryValue,
      todaySales,
      todaySalesCount,
      lowStockItems,
      topSellingItems,
      recentSales,
      totalItems,
      totalSalesThisMonth,
      totalSalesThisYear,
      averageOrderValue,
      profitMargins,
      inventoryTurnover,
      lowStockDetails,
      salesTrend,
      todayProfit
    ] = await Promise.all([
      // Total inventory value for this shop
      prisma.item.aggregate({
        where: { 
          isActive: true,
          shopId: shopId 
        },
        _sum: {
          stockQuantity: true,
        },
      }).then(async (result) => {
        const items = await prisma.item.findMany({
          where: { 
            isActive: true,
            shopId: shopId 
          },
          select: { stockQuantity: true, sellingPrice: true },
        })
        return items.reduce((total, item) => 
          total + (item.stockQuantity * parseFloat(item.sellingPrice)), 0
        )
      }),

      // Today's sales for this shop
      prisma.sale.aggregate({
        where: {
          shopId: shopId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Today's sales count for this shop
      prisma.sale.count({
        where: {
          shopId: shopId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Low stock items count for this shop
      prisma.item.count({
        where: {
          shopId: shopId,
          isActive: true,
          stockQuantity: {
            lte: prisma.item.fields.minStockLevel,
          },
        },
      }),

      // Top selling items this week for this shop
      prisma.saleItem.groupBy({
        by: ['itemId'],
        where: {
          sale: {
            shopId: shopId,
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
          where: { 
            id: { in: itemIds },
            shopId: shopId 
          },
        })
        
        return results.map(result => {
          const item = items.find(i => i.id === result.itemId)
          return {
            id: result.itemId,
            name: item?.name || 'Unknown',
            quantitySold: result._sum.quantity,
            revenue: result._sum.quantity * parseFloat(item?.sellingPrice || 0)
          }
        })
      }),

      // Recent sales for this shop
      prisma.sale.findMany({
        where: { shopId: shopId },
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

      // Total items for this shop
      prisma.item.count({
        where: { 
          isActive: true,
          shopId: shopId 
        },
      }),

      // Total sales this month for this shop
      prisma.sale.aggregate({
        where: {
          shopId: shopId,
          createdAt: {
            gte: monthAgo,
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Total sales this year for this shop
      prisma.sale.aggregate({
        where: {
          shopId: shopId,
          createdAt: {
            gte: yearAgo,
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Average order value this month for this shop
      prisma.sale.aggregate({
        where: {
          shopId: shopId,
          createdAt: {
            gte: monthAgo,
          },
        },
        _avg: {
          total: true,
        },
        _count: true,
      }),

      // Calculate profit margins for this shop
      prisma.item.findMany({
        where: {
          shopId: shopId,
          isActive: true
        },
        select: {
          purchasePrice: true,
          sellingPrice: true,
          stockQuantity: true
        }
      }).then(items => {
        const totalCost = items.reduce((sum, item) => 
          sum + (item.stockQuantity * parseFloat(item.purchasePrice)), 0)
        const totalValue = items.reduce((sum, item) => 
          sum + (item.stockQuantity * parseFloat(item.sellingPrice)), 0)
        const margin = totalValue > 0 ? ((totalValue - totalCost) / totalValue * 100) : 0
        return {
          totalCost,
          totalValue,
          margin: margin.toFixed(1)
        }
      }),

      // Inventory turnover calculation
      prisma.saleItem.aggregate({
        where: {
          sale: {
            shopId: shopId,
            createdAt: {
              gte: monthAgo,
            },
          },
        },
        _sum: {
          quantity: true,
        },
      }).then(async (soldItems) => {
        const avgInventory = await prisma.item.aggregate({
          where: {
            shopId: shopId,
            isActive: true
          },
          _avg: {
            stockQuantity: true
          }
        })
        const turnover = avgInventory._avg.stockQuantity > 0 
          ? (soldItems._sum.quantity || 0) / avgInventory._avg.stockQuantity 
          : 0
        return turnover.toFixed(2)
      }),

      // Detailed low stock items for this shop
      prisma.item.findMany({
        where: {
          shopId: shopId,
          isActive: true,
          stockQuantity: {
            lte: prisma.item.fields.minStockLevel,
          },
        },
        select: {
          id: true,
          name: true,
          stockQuantity: true,
          minStockLevel: true,
          category: true
        },
        take: 10
      }),

      // Sales trend (last 7 days) for this shop
      Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          const nextDate = new Date(date)
          nextDate.setDate(nextDate.getDate() + 1)
          
          return prisma.sale.aggregate({
            where: {
              shopId: shopId,
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
            _sum: {
              total: true,
            },
          }).then(result => ({
            date: date.toISOString().split('T')[0],
            sales: result._sum.total || 0
          }))
        })
      ).then(results => results.reverse()),

      // Today's profit for this shop
      prisma.sale.findMany({
        where: {
          shopId: shopId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          saleItems: {
            include: {
              item: {
                select: {
                  purchasePrice: true,
                },
              },
            },
          },
        },
      }).then(sales => {
        return sales.reduce((totalProfit, sale) => {
          const saleItemsProfit = sale.saleItems.reduce((profit, saleItem) => {
            const itemProfit = (parseFloat(saleItem.unitPrice) - parseFloat(saleItem.item.purchasePrice)) * saleItem.quantity;
            return profit + itemProfit;
          }, 0);
          const saleProfit = saleItemsProfit - parseFloat(sale.discount);
          return totalProfit + saleProfit;
        }, 0);
      })
    ])

    const stats = {
      shop: {
        id: shop.id,
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        email: shop.email
      },
      totalInventoryValue: totalInventoryValue || 0,
      todaySales: todaySales._sum.total || 0,
      todaySalesCount,
      lowStockItemsCount: lowStockItems,
      totalItems,
      totalSalesThisMonth: totalSalesThisMonth._sum.total || 0,
      totalSalesThisYear: totalSalesThisYear._sum.total || 0,
      averageOrderValue: averageOrderValue._avg.total || 0,
      totalOrders: averageOrderValue._count || 0,
      profitMargins,
      inventoryTurnover: parseFloat(inventoryTurnover),
      lowStockDetails,
      salesTrend,
      topSellingItems,
      recentSales: recentSales.map(sale => ({
        id: sale.id,
        customerName: sale.customerName,
        total: sale.total,
        createdAt: sale.createdAt,
        itemCount: sale.saleItems.length,
        items: sale.saleItems.map(si => si.item.name).join(', '),
      })),
      todayProfit: todayProfit || 0,
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