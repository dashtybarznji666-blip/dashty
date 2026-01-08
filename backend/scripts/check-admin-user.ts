import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin user in database...\n');

    // Check if database file exists
    const phoneNumber = '07509384229';
    const testPassword = 'DASHTYfalak2025@';

    // Find user by phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log('❌ User NOT FOUND in database');
      console.log(`   Phone Number: ${phoneNumber}`);
      console.log('\n💡 Solution: Run the seed script to create the admin user:');
      console.log('   npm run prisma:seed\n');
      return;
    }

    console.log('✅ User FOUND in database');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Phone Number: ${user.phoneNumber}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive ? '✅ Yes' : '❌ No'}`);
    console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
    console.log(`   Password Hash: ${user.password.substring(0, 20)}...`);

    // Test password
    console.log('\n🔐 Testing password...');
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    
    if (isValidPassword) {
      console.log('✅ Password is CORRECT');
    } else {
      console.log('❌ Password is INCORRECT');
      console.log('   The stored password hash does not match the expected password.');
      console.log('   This could mean:');
      console.log('   1. The password was changed manually');
      console.log('   2. The seed script was run with a different password');
      console.log('   3. The database was migrated from a different system');
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('\n⚠️  WARNING: User account is INACTIVE');
      console.log('   This will prevent login even with correct credentials.');
      console.log('   Solution: Activate the user account in the admin panel.');
    }

    // Summary
    console.log('\n📊 Summary:');
    if (user && isValidPassword && user.isActive) {
      console.log('✅ All checks passed! Login should work.');
    } else {
      console.log('❌ Issues found:');
      if (!user) {
        console.log('   - User does not exist');
      }
      if (user && !isValidPassword) {
        console.log('   - Password mismatch');
      }
      if (user && !user.isActive) {
        console.log('   - User account is inactive');
      }
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        phoneNumber: true,
        name: true,
        role: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (allUsers.length === 0) {
      console.log('   No users found.');
    } else {
      allUsers.forEach((u, index) => {
        console.log(`   ${index + 1}. ${u.phoneNumber} (${u.name}) - ${u.role} - ${u.isActive ? 'Active' : 'Inactive'}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Error checking admin user:', error);
    if (error.code === 'P1001') {
      console.error('\n💡 Database connection error. Check:');
      console.error('   1. DATABASE_URL in .env file');
      console.error('   2. Database file exists at the specified path');
      console.error('   3. Run migrations: npm run prisma:migrate');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
