import prisma from '../lib/prisma';
import { CreatePurchaseInput, UpdatePurchaseInput, PurchaseBalance, SupplierTodoGroup } from '../types';
import { StockService } from './stock.service';

export class PurchaseService {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  async getAllPurchases() {
    return prisma.purchase.findMany({
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });
  }

  async getPurchasesBySupplier(supplierId: string) {
    return prisma.purchase.findMany({
      where: { supplierId },
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });
  }

  async getPurchaseById(id: string) {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
    });
  }

  async getPurchaseBalance(purchaseId: string): Promise<PurchaseBalance> {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        payments: true,
      },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    const totalPaid = purchase.payments.reduce((sum, p) => sum + p.amount, 0) + purchase.paidAmount;

    return {
      totalCost: purchase.totalCost,
      paidAmount: totalPaid,
      remainingBalance: purchase.totalCost - totalPaid,
    };
  }

  async getCreditPurchases(supplierId: string) {
    return prisma.purchase.findMany({
      where: {
        supplierId,
        isCredit: true,
      },
      include: {
        shoe: true,
        payments: true,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });
  }

  async createPurchase(data: CreatePurchaseInput) {
    const totalCost = data.unitCost * data.quantity;

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        supplierId: data.supplierId,
        shoeId: data.shoeId,
        size: data.size,
        quantity: data.quantity,
        unitCost: data.unitCost,
        totalCost,
        isCredit: data.isCredit || false,
        paidAmount: data.paidAmount || 0,
        isTodo: data.isTodo || false,
        notes: data.notes,
        purchaseDate: data.purchaseDate || new Date(),
      },
      include: {
        supplier: true,
        shoe: true,
      },
    });

    // Optionally add to stock
    if (data.addToStock) {
      await this.stockService.addStock({
        shoeId: data.shoeId,
        size: data.size,
        quantity: data.quantity,
      });
    }

    return purchase;
  }

  async updatePurchase(id: string, data: UpdatePurchaseInput) {
    const updateData: any = { ...data };

    // Recalculate total cost if unitCost or quantity changed
    if (data.unitCost !== undefined || data.quantity !== undefined) {
      const purchase = await prisma.purchase.findUnique({ where: { id } });
      if (purchase) {
        const unitCost = data.unitCost ?? purchase.unitCost;
        const quantity = data.quantity ?? purchase.quantity;
        updateData.totalCost = unitCost * quantity;
      }
    }

    return prisma.purchase.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
    });
  }

  async deletePurchase(id: string) {
    return prisma.purchase.delete({
      where: { id },
    });
  }

  async getTodosGroupedBySupplier(): Promise<SupplierTodoGroup[]> {
    // Get all purchases marked as todo
    const todoPurchases = await prisma.purchase.findMany({
      where: {
        isTodo: true,
      },
      include: {
        supplier: true,
        shoe: {
          select: {
            id: true,
            name: true,
            brand: true,
            sku: true,
          },
        },
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });

    // Group by supplier
    const grouped = new Map<string, SupplierTodoGroup>();

    for (const purchase of todoPurchases) {
      const supplierId = purchase.supplierId;

      if (!grouped.has(supplierId)) {
        grouped.set(supplierId, {
          supplier: {
            id: purchase.supplier.id,
            name: purchase.supplier.name,
            contact: purchase.supplier.contact || undefined,
            address: purchase.supplier.address || undefined,
            notes: purchase.supplier.notes || undefined,
          },
          purchases: [],
        });
      }

      const group = grouped.get(supplierId)!;
      group.purchases.push({
        id: purchase.id,
        shoeId: purchase.shoeId,
        size: purchase.size,
        quantity: purchase.quantity,
        unitCost: purchase.unitCost,
        totalCost: purchase.totalCost,
        isCredit: purchase.isCredit,
        paidAmount: purchase.paidAmount,
        notes: purchase.notes || undefined,
        purchaseDate: purchase.purchaseDate,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
        shoe: {
          id: purchase.shoe.id,
          name: purchase.shoe.name,
          brand: purchase.shoe.brand,
          sku: purchase.shoe.sku,
        },
      });
    }

    // Convert map to array and sort by supplier name
    return Array.from(grouped.values()).sort((a, b) =>
      a.supplier.name.localeCompare(b.supplier.name)
    );
  }

  async markAsTodo(purchaseId: string) {
    return prisma.purchase.update({
      where: { id: purchaseId },
      data: { isTodo: true },
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
    });
  }

  async markAsDone(purchaseId: string) {
    return prisma.purchase.update({
      where: { id: purchaseId },
      data: { isTodo: false },
      include: {
        supplier: true,
        shoe: true,
        payments: true,
      },
    });
  }
}


