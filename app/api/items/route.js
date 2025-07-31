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
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
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
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { sku: { contains: search } },
        ],
      }),
      ...(category && { category }),
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.item.count({ where }),
    ])

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
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
      name,
      description,
      category,
      sku,
      purchasePrice,
      sellingPrice,
      stockQuantity,
      minStockLevel,
      shopId,
    } = body

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

    const finalSku = sku || Math.random().toString(36).substring(2, 10).toUpperCase()

    const item = await prisma.item.create({
      data: {
        name,
        description,
        category,
        sku: finalSku,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        stockQuantity: parseInt(stockQuantity),
        minStockLevel: parseInt(minStockLevel) || 5,
        shopId,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}