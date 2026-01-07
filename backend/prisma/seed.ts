import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.shoe.deleteMany();
  await prisma.exchangeRate.deleteMany();
  await prisma.user.deleteMany(); // Clear existing users

  // Create admin user
  const hashedPassword = await bcrypt.hash('DASHTYfalak2025@', 10);
  await prisma.user.create({
    data: {
      name: 'Admin',
      phoneNumber: '07509384229',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });

  // Create initial exchange rate (1 USD = 1300 IQD)
  await prisma.exchangeRate.create({
    data: {
      rate: 1300,
    },
  });

  // Create sample shoes (using Euro sizes)
  const shoe1 = await prisma.shoe.create({
    data: {
      name: 'Classic Running Shoes',
      brand: 'Nike',
      category: 'men',
      sizes: JSON.stringify(['39', '40', '41', '42', '43', '44', '45', '46']),
      price: 130000, // 130,000 IQD (approx $100 USD at 1300 rate)
      costPrice: 60.00, // $60 USD
      sku: 'NIKE-RUN-001',
      description: 'Comfortable running shoes for daily use',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    },
  });

  const shoe2 = await prisma.shoe.create({
    data: {
      name: 'Elegant Heels',
      brand: 'Zara',
      category: 'women',
      sizes: JSON.stringify(['35', '36', '37', '38', '39', '40', '41', '42']),
      price: 104000, // 104,000 IQD (approx $80 USD at 1300 rate)
      costPrice: 45.00, // $45 USD
      sku: 'ZARA-HEEL-001',
      description: 'Stylish high heels for formal occasions',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
    },
  });

  const shoe3 = await prisma.shoe.create({
    data: {
      name: 'Kids Sneakers',
      brand: 'Adidas',
      category: 'kids',
      sizes: JSON.stringify(['28', '30', '32', '34', '36']),
      price: 65000, // 65,000 IQD (approx $50 USD at 1300 rate)
      costPrice: 30.00, // $30 USD
      sku: 'ADIDAS-KIDS-001',
      description: 'Fun and colorful sneakers for kids',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
    },
  });

  // Add stock (using Euro sizes)
  await prisma.stock.createMany({
    data: [
      { shoeId: shoe1.id, size: '39', quantity: 20 },
      { shoeId: shoe1.id, size: '40', quantity: 18 },
      { shoeId: shoe1.id, size: '41', quantity: 15 },
      { shoeId: shoe1.id, size: '42', quantity: 12 },
      { shoeId: shoe1.id, size: '43', quantity: 10 },
      { shoeId: shoe1.id, size: '44', quantity: 8 },
      { shoeId: shoe1.id, size: '45', quantity: 6 },
      { shoeId: shoe1.id, size: '46', quantity: 5 },
      { shoeId: shoe2.id, size: '35', quantity: 10 },
      { shoeId: shoe2.id, size: '36', quantity: 12 },
      { shoeId: shoe2.id, size: '37', quantity: 15 },
      { shoeId: shoe2.id, size: '38', quantity: 18 },
      { shoeId: shoe2.id, size: '39', quantity: 12 },
      { shoeId: shoe2.id, size: '40', quantity: 10 },
      { shoeId: shoe2.id, size: '41', quantity: 7 },
      { shoeId: shoe2.id, size: '42', quantity: 5 },
      { shoeId: shoe3.id, size: '28', quantity: 25 },
      { shoeId: shoe3.id, size: '30', quantity: 30 },
      { shoeId: shoe3.id, size: '32', quantity: 22 },
      { shoeId: shoe3.id, size: '34', quantity: 18 },
      { shoeId: shoe3.id, size: '36', quantity: 15 },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('Admin user created:');
  console.log('  Phone: 07509384229');
  console.log('  Password: DASHTYfalak2025@');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


