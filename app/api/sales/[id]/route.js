import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-utils'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        saleItems: {
          include: {
            item: true,
          },
        },
      },
    })

    if (!sale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error fetching sale:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sale' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const { id } = await params
    const body = await request.json()
    const {
      customerName,
      paymentMethod,
      items,
      discount = 0,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    const existingSale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        saleItems: {
          include: {
            item: true,
          },
        },
        shop: true,
      },
    })

    if (!existingSale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    if (existingSale.shop.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const updatedSale = await prisma.$transaction(async (tx) => {
      // Restore stock from original sale items
      for (const saleItem of existingSale.saleItems) {
        await tx.item.update({
          where: { id: saleItem.itemId },
          data: {
            stockQuantity: {
              increment: saleItem.quantity,
            },
          },
        })
      }

      // Delete existing sale items
      await tx.saleItem.deleteMany({
        where: { saleId: parseInt(id) },
      })

      let subtotal = 0
      const saleItemsData = []

      // Process new sale items
      for (const saleItem of items) {
        const item = await tx.item.findFirst({
          where: { 
            id: saleItem.itemId,
            shopId: existingSale.shopId 
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
          saleId: parseInt(id),
          itemId: saleItem.itemId,
          quantity: saleItem.quantity,
          unitPrice: parseFloat(saleItem.unitPrice),
          subtotal: itemSubtotal,
        })

        // Deduct stock for new quantities
        await tx.item.update({
          where: { id: saleItem.itemId },
          data: {
            stockQuantity: {
              decrement: saleItem.quantity,
            },
          },
        })
      }

      // Create new sale items
      await tx.saleItem.createMany({
        data: saleItemsData,
      })

      const discountAmount = parseFloat(discount)
      const total = subtotal - discountAmount

      // Update the sale
      const updatedSale = await tx.sale.update({
        where: { id: parseInt(id) },
        data: {
          customerName,
          paymentMethod,
          subtotal,
          discount: discountAmount,
          total,
        },
        include: {
          saleItems: {
            include: {
              item: true,
            },
          },
        },
      })

      return updatedSale
    })

    return NextResponse.json(updatedSale)
  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update sale' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth()
    if (user instanceof NextResponse) return user

    const { id } = await params

    const existingSale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        saleItems: {
          include: {
            item: true,
          },
        },
        shop: true,
      },
    })

    if (!existingSale) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      )
    }

    if (existingSale.shop.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    await prisma.$transaction(async (tx) => {
      // Restore stock quantities
      for (const saleItem of existingSale.saleItems) {
        await tx.item.update({
          where: { id: saleItem.itemId },
          data: {
            stockQuantity: {
              increment: saleItem.quantity,
            },
          },
        })
      }

      // Delete sale items first (due to foreign key constraint)
      await tx.saleItem.deleteMany({
        where: { saleId: parseInt(id) },
      })

      // Delete the sale
      await tx.sale.delete({
        where: { id: parseInt(id) },
      })
    })

    return NextResponse.json({ message: 'Sale deleted successfully' })
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json(
      { error: 'Failed to delete sale' },
      { status: 500 }
    )
  }
}