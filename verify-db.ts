
import { prisma } from './lib/prisma';

async function main() {
  try {
    console.log('Attempting to connect to database...');
    const count = await prisma.user.count();
    console.log(`Successfully connected! User count: ${count}`);
    
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        requestCount: true,
        responseCount: true
      }
    });
    
    if (users.length > 0) {
      console.log('Sample user stats:', users[0]);
    } else {
      console.log('No users found, but connection works.');
    }
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
