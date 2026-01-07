"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Clear existing data
    await prisma.sale.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.shoe.deleteMany();
    await prisma.exchangeRate.deleteMany();
    // Create initial exchange rate (1 USD = 1300 IQD)
    await prisma.exchangeRate.create({
        data: {
            rate: 1300,
        },
    });
    // Create sample shoes
    const shoe1 = await prisma.shoe.create({
        data: {
            name: 'Classic Running Shoes',
            brand: 'Nike',
            category: 'men',
            sizes: JSON.stringify(['8', '9', '10', '11', '12']),
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
            sizes: JSON.stringify(['6', '7', '8', '9']),
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
            sizes: JSON.stringify(['3', '4', '5', '6']),
            price: 65000, // 65,000 IQD (approx $50 USD at 1300 rate)
            costPrice: 30.00, // $30 USD
            sku: 'ADIDAS-KIDS-001',
            description: 'Fun and colorful sneakers for kids',
            imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
        },
    });
    // Add stock
    await prisma.stock.createMany({
        data: [
            { shoeId: shoe1.id, size: '8', quantity: 15 },
            { shoeId: shoe1.id, size: '9', quantity: 20 },
            { shoeId: shoe1.id, size: '10', quantity: 18 },
            { shoeId: shoe1.id, size: '11', quantity: 12 },
            { shoeId: shoe1.id, size: '12', quantity: 8 },
            { shoeId: shoe2.id, size: '6', quantity: 5 },
            { shoeId: shoe2.id, size: '7', quantity: 10 },
            { shoeId: shoe2.id, size: '8', quantity: 12 },
            { shoeId: shoe2.id, size: '9', quantity: 7 },
            { shoeId: shoe3.id, size: '3', quantity: 25 },
            { shoeId: shoe3.id, size: '4', quantity: 30 },
            { shoeId: shoe3.id, size: '5', quantity: 22 },
            { shoeId: shoe3.id, size: '6', quantity: 15 },
        ],
    });
    console.log('Seed data created successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
