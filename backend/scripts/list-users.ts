import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('Connected to database\n');

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        phoneNumber: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('=== Registered Users ===\n');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Total users: ${users.length}\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.phoneNumber}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });

      // Also print just phone numbers
      console.log('\n=== Phone Number List ===');
      users.forEach((user) => {
        console.log(user.phoneNumber);
      });
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();

