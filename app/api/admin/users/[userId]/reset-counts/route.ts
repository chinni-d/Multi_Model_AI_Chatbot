import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { resetUserCounts } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
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
      currentUser.publicMetadata?.role === 'admin' ||
      currentUser.publicMetadata?.role === 'super_admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId: targetUserId } = await params
    
    // Get user details for email
    const userToReset = await client.users.getUser(targetUserId);
    const userEmail = userToReset.emailAddresses[0]?.emailAddress;
    const userName = userToReset.firstName 
      ? `${userToReset.firstName} ${userToReset.lastName || ''}`.trim() 
      : 'User';

    const updatedUser = await resetUserCounts(targetUserId)

    if (userEmail) {
      console.log('Sending reset counts email to:', userEmail, 'Name:', userName);
      const { sendResetCountsEmail } = await import("@/lib/mail");
      await sendResetCountsEmail(userEmail, userName);
    } else {
      console.warn('No email found for user:', targetUserId);
    }

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
