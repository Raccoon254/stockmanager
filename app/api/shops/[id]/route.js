import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const shop = await prisma.shop.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
        isActive: true
      },
      include: {
        _count: {
          select: {
            items: true,
            sales: true
          }
        }
      }
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(shop)
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Shop name must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // Check if shop exists and user owns it
    const existingShop = await prisma.shop.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
        isActive: true
      }
    })

    if (!existingShop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Check if user already has another shop with this name
    const duplicateShop = await prisma.shop.findFirst({
      where: {
        ownerId: session.user.id,
        name: name.trim(),
        isActive: true,
        NOT: {
          id: params.id
        }
      }
    })

    if (duplicateShop) {
      return NextResponse.json(
        { error: 'You already have a shop with this name' },
        { status: 400 }
      )
    }

    const shop = await prisma.shop.update({
      where: {
        id: params.id
      },
      data: {
        name: name.trim(),
        description: description?.trim() || null
      },
      include: {
        _count: {
          select: {
            items: true,
            sales: true
          }
        }
      }
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if shop exists and user owns it
    const existingShop = await prisma.shop.findFirst({
      where: {
        id: params.id,
        ownerId: session.user.id,
        isActive: true
      }
    })

    if (!existingShop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Soft delete - set isActive to false
    await prisma.shop.update({
      where: {
        id: params.id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ message: 'Shop deleted successfully' })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    )
  }
}