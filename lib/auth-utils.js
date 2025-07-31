import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }
  
  return session.user
}

export async function requireAuth() {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return user
}

export async function validateShopAccess(shopId, userId) {
  const shop = await prisma.shop.findFirst({
    where: {
      id: shopId,
      ownerId: userId,
      isActive: true
    }
  })
  
  return shop
}

export async function requireShopAccess(shopId) {
  const user = await requireAuth()
  
  if (user instanceof NextResponse) {
    return user // Return the error response
  }
  
  const shop = await validateShopAccess(shopId, user.id)
  
  if (!shop) {
    return NextResponse.json(
      { error: 'Shop not found or access denied' },
      { status: 404 }
    )
  }
  
  return { user, shop }
}