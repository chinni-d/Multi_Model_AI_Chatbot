import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { incrementRequestCount, incrementResponseCount } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type } = body // 'request' or 'response'

    if (!type || !['request', 'response'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "request" or "response"' }, { status: 400 })
    }

    let updatedUser
    if (type === 'request') {
      updatedUser = await incrementRequestCount(userId)
    } else {
      updatedUser = await incrementResponseCount(userId)
    }

    return NextResponse.json({
      success: true,
      requestCount: updatedUser.requestCount,
      responseCount: updatedUser.responseCount
    })
  } catch (error) {
    console.error('Error tracking message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}