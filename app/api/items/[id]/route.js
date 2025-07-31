import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        stockAdjustments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
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
      stockAdjustmentReason,
    } = body

    const existingItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const stockChange = parseInt(stockQuantity) - existingItem.stockQuantity

    const updatedItem = await prisma.$transaction(async (tx) => {
      const item = await tx.item.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          category,
          sku,
          purchasePrice: parseFloat(purchasePrice),
          sellingPrice: parseFloat(sellingPrice),
          stockQuantity: parseInt(stockQuantity),
          minStockLevel: parseInt(minStockLevel) || 5,
        },
      })

      if (stockChange !== 0 && stockAdjustmentReason) {
        await tx.stockAdjustment.create({
          data: {
            itemId: parseInt(id),
            quantity: stockChange,
            reason: stockAdjustmentReason,
          },
        })
      }

      return item
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}