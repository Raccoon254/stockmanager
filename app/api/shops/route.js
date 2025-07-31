import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const shops = await prisma.shop.findMany({
      where: {
        ownerId: session.user.id,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json({ shops })
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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

    // Check if user already has a shop with this name
    const existingShop = await prisma.shop.findFirst({
      where: {
        ownerId: session.user.id,
        name: name.trim(),
        isActive: true
      }
    })

    if (existingShop) {
      return NextResponse.json(
        { error: 'You already have a shop with this name' },
        { status: 400 }
      )
    }

    const shop = await prisma.shop.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ownerId: session.user.id
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

    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    console.error('Error creating shop:', error)
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    )
  }
}