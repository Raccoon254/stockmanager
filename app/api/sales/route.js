import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'

export async function GET(request) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const shopId = searchParams.get('shopId')

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

    const skip = (page - 1) * limit

    const where = {
      shopId,
      ...(search && {
        customerName: { contains: search, mode: 'insensitive' },
      }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          saleItems: {
            include: {
              item: true,
            },
          },
        },
      }),
      prisma.sale.count({ where }),
    ])

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const body = await request.json()
    const {
      customerName,
      paymentMethod,
      items,
      discount = 0,
      shopId,
    } = body

    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
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

    const sale = await prisma.$transaction(async (tx) => {
      let subtotal = 0
      const saleItemsData = []

      for (const saleItem of items) {
        const item = await tx.item.findFirst({
          where: { 
            id: saleItem.itemId,
            shopId: shopId 
          },
        })

        if (!item) {
          throw new Error(`Item with ID ${saleItem.itemId} not found`)
        }

        if (item.stockQuantity < saleItem.quantity) {
          throw new Error(`Insufficient stock for ${item.name}. Available: ${item.stockQuantity}, Requested: ${saleItem.quantity}`)
        }

        const itemSubtotal = parseFloat(saleItem.unitPrice) * saleItem.quantity
        subtotal += itemSubtotal

        saleItemsData.push({
          itemId: saleItem.itemId,
          quantity: saleItem.quantity,
          unitPrice: parseFloat(saleItem.unitPrice),
          subtotal: itemSubtotal,
        })

        await tx.item.update({
          where: { id: saleItem.itemId },
          data: {
            stockQuantity: {
              decrement: saleItem.quantity,
            },
          },
        })
      }

      const discountAmount = parseFloat(discount)
      const total = subtotal - discountAmount

      const newSale = await tx.sale.create({
        data: {
          customerName,
          paymentMethod,
          subtotal,
          discount: discountAmount,
          total,
          shopId,
          saleItems: {
            create: saleItemsData,
          },
        },
        include: {
          saleItems: {
            include: {
              item: true,
            },
          },
        },
      })

      return newSale
    })

    return NextResponse.json(sale, { status: 201 })
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create sale' },
      { status: 500 }
    )
  }
}