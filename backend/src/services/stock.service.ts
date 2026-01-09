import prisma from '../lib/prisma';
import { AddStockInput } from '../types';

export class StockService {
  async getAllStock(skip: number = 0, take: number = 100) {
    return prisma.stock.findMany({
      include: {
        shoe: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getStockByShoeId(shoeId: string) {
    return prisma.stock.findMany({
      where: { shoeId },
      include: {
        shoe: true,
      },
    });
  }

  async addStock(data: AddStockInput) {
    // Check if stock entry exists
    const existingStock = await prisma.stock.findUnique({
      where: {
        shoeId_size: {
          shoeId: data.shoeId,
          size: data.size,
        },
      },
    });

    if (existingStock) {
      // Update existing stock
      return prisma.stock.update({
        where: { id: existingStock.id },
        data: {
          quantity: existingStock.quantity + data.quantity,
        },
        include: {
          shoe: true,
        },
      });
    } else {
      // Create new stock entry
      return prisma.stock.create({
        data,
        include: {
          shoe: true,
        },
      });
    }
  }

  async bulkAddStock(shoeId: string, stockEntries: Array<{ size: string; quantity: number }>) {
    const results: Awaited<ReturnType<typeof this.addStock>>[] = [];
    
    for (const entry of stockEntries) {
      if (entry.quantity > 0) {
        const result = await this.addStock({
          shoeId,
          size: entry.size,
          quantity: entry.quantity,
        });
        results.push(result);
      }
    }
    
    return results;
  }

  async updateStock(id: string, quantity: number) {
    return prisma.stock.update({
      where: { id },
      data: { quantity },
      include: {
        shoe: true,
      },
    });
  }

  async deductStock(shoeId: string, size: string, quantity: number) {
    const stock = await prisma.stock.findUnique({
      where: {
        shoeId_size: {
          shoeId,
          size,
        },
      },
    });

    if (!stock) {
      throw new Error('Stock not found for this shoe and size');
    }

    if (stock.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    return prisma.stock.update({
      where: { id: stock.id },
      data: {
        quantity: stock.quantity - quantity,
      },
      include: {
        shoe: true,
      },
    });
  }

  async getLowStockItems(threshold: number = 3) {
    // Get all stock entries with shoe information
    const allStock = await prisma.stock.findMany({
      include: {
        shoe: true,
      },
    });

    // Group by shoeId and sum quantities
    const stockByShoe = new Map<string, { shoe: any; totalQuantity: number; stockEntries: any[] }>();

    for (const stockEntry of allStock) {
      const shoeId = stockEntry.shoeId;
      if (!stockByShoe.has(shoeId)) {
        stockByShoe.set(shoeId, {
          shoe: stockEntry.shoe,
          totalQuantity: 0,
          stockEntries: [],
        });
      }
      const shoeStock = stockByShoe.get(shoeId)!;
      shoeStock.totalQuantity += stockEntry.quantity;
      shoeStock.stockEntries.push(stockEntry);
    }

    // Filter shoes where total quantity < threshold
    const lowStockShoes = Array.from(stockByShoe.values())
      .filter((item) => item.totalQuantity < threshold)
      .sort((a, b) => a.totalQuantity - b.totalQuantity);

    // Return in a format compatible with Stock[] but representing items, not sizes
    return lowStockShoes.map((item) => ({
      id: item.shoe.id, // Use shoeId as id for frontend identification
      shoeId: item.shoe.id,
      size: '', // Empty size since we're aggregating all sizes
      quantity: item.totalQuantity, // Total quantity across all sizes
      createdAt: item.shoe.createdAt,
      updatedAt: item.shoe.updatedAt,
      shoe: item.shoe,
    }));
  }

  async deleteStock(id: string) {
    return prisma.stock.delete({
      where: { id },
      include: {
        shoe: true,
      },
    });
  }
}


