import prisma from '../lib/prisma';
import { CreateSupplierInput, UpdateSupplierInput, SupplierBalance } from '../types';

export class SupplierService {
  async getAllSuppliers() {
    return prisma.supplier.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getSupplierById(id: string) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            shoe: true,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        },
        payments: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });
  }

  async getSupplierBalance(supplierId: string): Promise<SupplierBalance> {
    // Get all credit purchases
    const creditPurchases = await prisma.purchase.findMany({
      where: {
        supplierId,
        isCredit: true,
      },
    });

    const totalCredit = creditPurchases.reduce((sum, p) => sum + p.totalCost, 0);

    // Get all payments
    const payments = await prisma.supplierPayment.findMany({
      where: { supplierId },
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalCredit,
      totalPaid,
      outstandingBalance: totalCredit - totalPaid,
    };
  }

  async getSupplierWithBalance(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            shoe: true,
          },
          orderBy: {
            purchaseDate: 'desc',
          },
        },
        payments: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    });

    if (!supplier) return null;

    const balance = await this.getSupplierBalance(id);

    return {
      ...supplier,
      balance,
    };
  }

  async createSupplier(data: CreateSupplierInput) {
    return prisma.supplier.create({
      data,
    });
  }

  async updateSupplier(id: string, data: UpdateSupplierInput) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async deleteSupplier(id: string) {
    return prisma.supplier.delete({
      where: { id },
    });
  }
}








