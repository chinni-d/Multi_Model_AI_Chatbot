import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure absolute path to database file to avoid "Unable to open database file" errors
// Replace backslashes with forward slashes for Windows compatibility
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')
// On Windows, we need to ensure the path is properly formatted for the connection string
const connectionString = `file:${dbPath}`

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: {
        url: connectionString,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma