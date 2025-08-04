import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'

export async function GET(request) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const days = parseInt(searchParams.get('days') || '7')

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

    // Calculate date range
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - (days - 1))
    startDate.setHours(0, 0, 0, 0)

    // Generate array of all dates in range
    const dateRange = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(new Date(d))
    }

    // Fetch sales data for the date range
    const sales = await prisma.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        total: true,
        createdAt: true,
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group sales by date
    const salesByDate = {}
    sales.forEach(sale => {
      const dateKey = sale.createdAt.toISOString().split('T')[0]
      if (!salesByDate[dateKey]) {
        salesByDate[dateKey] = {
          total: 0,
          count: 0,
          sales: []
        }
      }
      salesByDate[dateKey].total += parseFloat(sale.total)
      salesByDate[dateKey].count += 1
      salesByDate[dateKey].sales.push(sale)
    })

    // Create daily data array with all dates (including zeros)
    const dailyData = dateRange.map(date => {
      const dateKey = date.toISOString().split('T')[0]
      const dayData = salesByDate[dateKey] || { total: 0, count: 0, sales: [] }
      
      return {
        date: dateKey,
        total: dayData.total,
        count: dayData.count,
        sales: dayData.sales
      }
    })

    // Calculate summary statistics
    const totalSales = dailyData.reduce((sum, day) => sum + day.total, 0)
    const totalTransactions = dailyData.reduce((sum, day) => sum + day.count, 0)
    const averageDaily = totalSales / days
    const peakDay = dailyData.reduce((max, day) => day.total > max.total ? day : max, { total: 0 })
    
    // Calculate growth rate (comparing first half vs second half)
    const midPoint = Math.floor(days / 2)
    const firstHalf = dailyData.slice(0, midPoint)
    const secondHalf = dailyData.slice(midPoint)
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.total, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.total, 0) / secondHalf.length
    
    const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0

    return NextResponse.json({
      dailyData,
      summary: {
        totalSales,
        totalTransactions,
        averageDaily,
        peakDay: peakDay.total > 0 ? peakDay : null,
        growthRate,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days
        }
      }
    })

  } catch (error) {
    console.error('Error fetching sales trend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales trend data' },
      { status: 500 }
    )
  }
}