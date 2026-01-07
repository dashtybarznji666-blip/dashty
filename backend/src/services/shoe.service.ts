import prisma from '../lib/prisma';
import { CreateShoeInput, UpdateShoeInput } from '../types';

export class ShoeService {
  async getAllShoes(skip: number = 0, take: number = 100) {
    return prisma.shoe.findMany({
      include: {
        stock: true,
        _count: {
          select: { sales: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });
  }

  async getShoeById(id: string) {
    return prisma.shoe.findUnique({
      where: { id },
      include: {
        stock: true,
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async createShoe(data: CreateShoeInput) {
    // Check if SKU already exists
    const existingShoe = await prisma.shoe.findUnique({
      where: { sku: data.sku },
    });

    if (existingShoe) {
      throw new Error('SKU already exists');
    }

    return prisma.shoe.create({
      data: {
        ...data,
        sizes: JSON.stringify(data.sizes),
      },
      include: {
        stock: true,
      },
    });
  }

  async updateShoe(id: string, data: UpdateShoeInput) {
    // Check if SKU is being updated and if it already exists
    if (data.sku) {
      const existingShoe = await prisma.shoe.findUnique({
        where: { sku: data.sku },
      });

      if (existingShoe && existingShoe.id !== id) {
        throw new Error('SKU already exists');
      }
    }

    return prisma.shoe.update({
      where: { id },
      data: {
        ...data,
        sizes: data.sizes ? JSON.stringify(data.sizes) : undefined,
      },
      include: {
        stock: true,
      },
    });
  }

  async deleteShoe(id: string) {
    return prisma.shoe.delete({
      where: { id },
    });
  }
}


