import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { resetUserCounts } from '@/lib/db'

interface RouteParams {
  params: {
    userId: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: currentUserId } = await auth()
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const client = await clerkClient()
    const currentUser = await client.users.getUser(currentUserId)
    const isAdmin = 
      currentUser.emailAddresses[0]?.emailAddress?.includes('admin') ||
      currentUser.publicMetadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId: targetUserId } = params
    
    const updatedUser = await resetUserCounts(targetUserId)

    return NextResponse.json({
      success: true,
      message: 'User counts reset successfully',
      requestCount: updatedUser.requestCount,
      responseCount: updatedUser.responseCount
    })
  } catch (error) {
    console.error('Error resetting user counts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}