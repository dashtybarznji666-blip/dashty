import prisma from '../lib/prisma';
import { CreateSaleInput, AddStockInput } from '../types';
import { StockService } from './stock.service';
import { ExchangeRateService } from './exchange-rate.service';

export class SaleService {
  private stockService: StockService;
  private exchangeRateService: ExchangeRateService;

  constructor() {
    this.stockService = new StockService();
    this.exchangeRateService = new ExchangeRateService();
  }

  async getAllSales(skip: number = 0, take: number = 100) {
    return prisma.sale.findMany({
      include: {
        shoe: true,
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getSaleById(id: string) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        shoe: true,
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    return sale;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date, skip: number = 0, take: number = 100) {
    return prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        shoe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getTodaySales(skip: number = 0, take: number = 100) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getSalesByDateRange(today, tomorrow, skip, take);
  }

  async getOnlineSales(skip: number = 0, take: number = 100) {
    return prisma.sale.findMany({
      where: {
        isOnline: true,
      },
      include: {
        shoe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async createSale(data: CreateSaleInput, userId?: string) {
    // Get shoe details
    const shoe = await prisma.shoe.findUnique({
      where: { id: data.shoeId },
    });

    if (!shoe) {
      throw new Error('Shoe not found');
    }

    // Get current exchange rate
    const exchangeRate = await this.exchangeRateService.getCurrentRate();

    // Deduct stock
    await this.stockService.deductStock(data.shoeId, data.size, data.quantity);

    // Calculate prices and profit
    // unitPrice is in IQD (from input), costPrice is in USD
    const unitPriceIQD = data.unitPrice || shoe.price; // Use provided price or shoe's default price
    const totalPriceIQD = unitPriceIQD * data.quantity;
    
    // Convert cost price from USD to IQD, then calculate profit
    const costPriceIQD = shoe.costPrice * exchangeRate;
    const profitIQD = (unitPriceIQD - costPriceIQD) * data.quantity;

    // Create sale
    try {
      return await prisma.sale.create({
        data: {
          shoeId: data.shoeId,
          userId: userId || null, // Store userId if provided
          size: data.size,
          quantity: data.quantity,
          unitPrice: unitPriceIQD,
          totalPrice: totalPriceIQD,
          profit: profitIQD,
          exchangeRate,
          isOnline: data.isOnline || false,
        },
        include: {
          shoe: true,
          user: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
        },
      });
    } catch (error: any) {
      console.error('Prisma error creating sale:', error);
      throw error;
    }
  }

  async getSalesStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Use Prisma aggregations instead of loading all records into memory
    const [totalStats, todayStats] = await Promise.all([
      prisma.sale.aggregate({
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
    ]);

    return {
      totalSales: totalStats._count.id || 0,
      totalRevenue: totalStats._sum.totalPrice || 0,
      totalProfit: totalStats._sum.profit || 0,
      todaySales: todayStats._count.id || 0,
      todayRevenue: todayStats._sum.totalPrice || 0,
      todayProfit: todayStats._sum.profit || 0,
    };
  }

  async deleteAllSales() {
    const result = await prisma.sale.deleteMany({});
    return { deletedCount: result.count };
  }

  async deleteAllShippingSales() {
    const result = await prisma.sale.deleteMany({
      where: {
        isOnline: true,
      },
    });
    return { deletedCount: result.count };
  }

  async deleteSale(id: string) {
    // Get sale details before deleting to restore stock
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { shoe: true },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    // Restore stock
    await this.stockService.addStock({
      shoeId: sale.shoeId,
      size: sale.size,
      quantity: sale.quantity,
    });

    // Delete the sale
    await prisma.sale.delete({
      where: { id },
    });

    return sale;
  }

  async getSalesByUser(userId: string, skip: number = 0, take: number = 100) {
    return prisma.sale.findMany({
      where: {
        userId,
      },
      include: {
        shoe: true,
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getUserSalesStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [totalStats, todayStats, weekStats, monthStats, bestSelling] = await Promise.all([
      prisma.sale.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
        _avg: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: weekAgo,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: monthAgo,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.groupBy({
        by: ['shoeId'],
        where: { userId },
        _sum: {
          quantity: true,
          totalPrice: true,
          profit: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            totalPrice: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Get shoe details for best selling
    const bestSellingWithShoes = await Promise.all(
      bestSelling.map(async (item) => {
        const shoe = await prisma.shoe.findUnique({
          where: { id: item.shoeId },
          select: {
            id: true,
            name: true,
            brand: true,
            sku: true,
          },
        });
        return {
          shoe,
          quantity: item._sum.quantity || 0,
          revenue: item._sum.totalPrice || 0,
          profit: item._sum.profit || 0,
          salesCount: item._count.id || 0,
        };
      })
    );

    return {
      totalSales: totalStats._count.id || 0,
      totalRevenue: totalStats._sum.totalPrice || 0,
      totalProfit: totalStats._sum.profit || 0,
      averageSaleAmount: totalStats._avg.totalPrice || 0,
      averageProfit: totalStats._avg.profit || 0,
      todaySales: todayStats._count.id || 0,
      todayRevenue: todayStats._sum.totalPrice || 0,
      todayProfit: todayStats._sum.profit || 0,
      weekSales: weekStats._count.id || 0,
      weekRevenue: weekStats._sum.totalPrice || 0,
      weekProfit: weekStats._sum.profit || 0,
      monthSales: monthStats._count.id || 0,
      monthRevenue: monthStats._sum.totalPrice || 0,
      monthProfit: monthStats._sum.profit || 0,
      bestSellingProducts: bestSellingWithShoes,
    };
  }
}


