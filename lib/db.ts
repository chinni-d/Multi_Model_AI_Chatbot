import { prisma } from './prisma'

// Get or create user by Clerk ID
export async function getOrCreateUser(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId } as any
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        requestCount: 0,
        responseCount: 0
      } as any
    })
  }

  return user
}

// Increment request count for user
export async function incrementRequestCount(clerkId: string) {
  const user = await getOrCreateUser(clerkId)
  
  return await prisma.user.update({
    where: { id: user.id },
    data: {
      requestCount: { increment: 1 }
    } as any
  })
}

// Increment response count for user
export async function incrementResponseCount(clerkId: string) {
  const user = await getOrCreateUser(clerkId)
  
  return await prisma.user.update({
    where: { id: user.id },
    data: {
      responseCount: { increment: 1 }
    } as any
  })
}

// Reset counts for a specific user
export async function resetUserCounts(clerkId: string) {
  const user = await getOrCreateUser(clerkId)
  
  return await prisma.user.update({
    where: { id: user.id },
    data: {
      requestCount: 0,
      responseCount: 0
    } as any
  })
}

// Reset counts for all users
export async function resetAllUserCounts() {
  return await prisma.user.updateMany({
    data: {
      requestCount: 0,
      responseCount: 0
    } as any
  })
}

// Get user stats
export async function getUserStats(clerkId: string) {
  const user = await getOrCreateUser(clerkId)
  
  return {
    requestCount: user.requestCount,
    responseCount: user.responseCount,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

// Get all users with their stats
export async function getAllUsersStats() {
  return await prisma.user.findMany({
    select: {
      clerkId: true,
      requestCount: true,
      responseCount: true,
      createdAt: true,
      updatedAt: true
    }
  })
}