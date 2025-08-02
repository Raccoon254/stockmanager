import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'

export async function GET(request) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const timeframe = searchParams.get('timeframe') || 'today' // today, week, month, year
    
    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required' },
        { status: 400 }
      )
    }

    // Verify user has access to this shop
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId,
        ownerId: user.id,
        isActive: true
      }
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found or access denied' },
        { status: 404 }
      )
    }

    // Calculate date ranges based on timeframe
    const now = new Date()
    let startDate, endDate
    
    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        startDate = weekStart
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    }

    // Fetch sales data with detailed profit calculations
    const sales = await prisma.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        saleItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate detailed profit metrics
    let totalRevenue = 0
    let totalCost = 0
    let totalProfit = 0
    let totalItems = 0
    const categoryProfits = {}
    const itemProfits = []
    const dailyProfits = {}
    const hourlyProfits = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      revenue: 0,
      cost: 0,
      profit: 0,
      transactions: 0
    }))

    sales.forEach(sale => {
      const saleRevenue = parseFloat(sale.total)
      let saleCost = 0
      let saleProfit = 0

      sale.saleItems.forEach(saleItem => {
        const itemRevenue = parseFloat(saleItem.unitPrice) * saleItem.quantity
        const itemCost = parseFloat(saleItem.item.purchasePrice) * saleItem.quantity
        const itemProfit = itemRevenue - itemCost

        saleCost += itemCost
        saleProfit += itemProfit
        totalItems += saleItem.quantity

        // Category profits
        const category = saleItem.item.category
        if (!categoryProfits[category]) {
          categoryProfits[category] = {
            category,
            revenue: 0,
            cost: 0,
            profit: 0,
            margin: 0,
            items: 0
          }
        }
        categoryProfits[category].revenue += itemRevenue
        categoryProfits[category].cost += itemCost
        categoryProfits[category].profit += itemProfit
        categoryProfits[category].items += saleItem.quantity

        // Item profits tracking
        const existingItemProfit = itemProfits.find(ip => ip.itemId === saleItem.item.id)
        if (existingItemProfit) {
          existingItemProfit.revenue += itemRevenue
          existingItemProfit.cost += itemCost
          existingItemProfit.profit += itemProfit
          existingItemProfit.quantitySold += saleItem.quantity
        } else {
          itemProfits.push({
            itemId: saleItem.item.id,
            name: saleItem.item.name,
            category: saleItem.item.category,
            revenue: itemRevenue,
            cost: itemCost,
            profit: itemProfit,
            margin: itemRevenue > 0 ? ((itemProfit / itemRevenue) * 100) : 0,
            quantitySold: saleItem.quantity,
            unitPrice: parseFloat(saleItem.unitPrice),
            purchasePrice: parseFloat(saleItem.item.purchasePrice)
          })
        }
      })

      totalRevenue += saleRevenue
      totalCost += saleCost
      totalProfit += saleProfit

      // Daily profits (for trends)
      const dateKey = sale.createdAt.toISOString().split('T')[0]
      if (!dailyProfits[dateKey]) {
        dailyProfits[dateKey] = {
          date: dateKey,
          revenue: 0,
          cost: 0,
          profit: 0,
          transactions: 0
        }
      }
      dailyProfits[dateKey].revenue += saleRevenue
      dailyProfits[dateKey].cost += saleCost
      dailyProfits[dateKey].profit += saleProfit
      dailyProfits[dateKey].transactions += 1

      // Hourly profits
      const hour = sale.createdAt.getHours()
      hourlyProfits[hour].revenue += saleRevenue
      hourlyProfits[hour].cost += saleCost
      hourlyProfits[hour].profit += saleProfit
      hourlyProfits[hour].transactions += 1
    })

    // Calculate margins for categories
    Object.values(categoryProfits).forEach(cat => {
      cat.margin = cat.revenue > 0 ? ((cat.profit / cat.revenue) * 100) : 0
    })

    // Sort and prepare data
    const topCategories = Object.values(categoryProfits)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)

    const topItems = itemProfits
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)

    const dailyTrend = Object.values(dailyProfits)
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    const peakHour = hourlyProfits
      .filter(h => h.transactions > 0)
      .reduce((max, hour) => hour.profit > max.profit ? hour : max, { profit: 0, hour: 0 })

    // Calculate overall metrics
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0
    const averageOrderProfit = sales.length > 0 ? (totalProfit / sales.length) : 0
    const costRatio = totalRevenue > 0 ? ((totalCost / totalRevenue) * 100) : 0

    return NextResponse.json({
      timeframe,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      summary: {
        totalRevenue,
        totalCost,
        totalProfit,
        profitMargin,
        costRatio,
        averageOrderProfit,
        totalTransactions: sales.length,
        totalItems,
        avgProfitPerItem: totalItems > 0 ? (totalProfit / totalItems) : 0
      },
      trends: {
        daily: dailyTrend,
        hourly: hourlyProfits.filter(h => h.transactions > 0),
        peakHour: peakHour.transactions > 0 ? peakHour : null
      },
      breakdown: {
        categories: topCategories,
        items: topItems
      },
      recentSales: sales.slice(0, 10).map(sale => ({
        id: sale.id,
        customerName: sale.customerName,
        total: parseFloat(sale.total),
        profit: sale.saleItems.reduce((sum, item) => 
          sum + ((parseFloat(item.unitPrice) - parseFloat(item.item.purchasePrice)) * item.quantity), 0
        ),
        margin: parseFloat(sale.total) > 0 ? 
          (sale.saleItems.reduce((sum, item) => 
            sum + ((parseFloat(item.unitPrice) - parseFloat(item.item.purchasePrice)) * item.quantity), 0
          ) / parseFloat(sale.total)) * 100 : 0,
        itemCount: sale.saleItems.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: sale.createdAt
      }))
    })
    
  } catch (error) {
    console.error('Error fetching profit analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profit analysis' },
      { status: 500 }
    )
  }
}