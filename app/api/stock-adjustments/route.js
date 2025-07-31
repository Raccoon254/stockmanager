import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { itemId, quantity, reason } = body

    if (!itemId || !quantity || !reason) {
      return NextResponse.json(
        { error: 'Item ID, quantity, and reason are required' },
        { status: 400 }
      )
    }

    const item = await prisma.item.findUnique({
      where: { id: parseInt(itemId) },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const adjustment = await prisma.$transaction(async (tx) => {
      const stockAdjustment = await tx.stockAdjustment.create({
        data: {
          itemId: parseInt(itemId),
          quantity: parseInt(quantity),
          reason,
        },
      })

      await tx.item.update({
        where: { id: parseInt(itemId) },
        data: {
          stockQuantity: {
            increment: parseInt(quantity),
          },
        },
      })

      return stockAdjustment
    })

    return NextResponse.json(adjustment, { status: 201 })
  } catch (error) {
    console.error('Error creating stock adjustment:', error)
    return NextResponse.json(
      { error: 'Failed to create stock adjustment' },
      { status: 500 }
    )
  }
}