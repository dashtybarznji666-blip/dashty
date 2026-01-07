import prisma from '../lib/prisma';
import { CreateSupplierPaymentInput, UpdateSupplierPaymentInput } from '../types';

export class SupplierPaymentService {
  async getAllPayments() {
    return prisma.supplierPayment.findMany({
      include: {
        supplier: true,
        purchase: {
          include: {
            shoe: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
  }

  async getPaymentsBySupplier(supplierId: string) {
    return prisma.supplierPayment.findMany({
      where: { supplierId },
      include: {
        supplier: true,
        purchase: {
          include: {
            shoe: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });
  }

  async getPaymentById(id: string) {
    return prisma.supplierPayment.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchase: {
          include: {
            shoe: true,
          },
        },
      },
    });
  }

  async createPayment(data: CreateSupplierPaymentInput) {
    const payment = await prisma.supplierPayment.create({
      data: {
        supplierId: data.supplierId,
        purchaseId: data.purchaseId,
        amount: data.amount,
        paymentDate: data.paymentDate || new Date(),
        notes: data.notes,
      },
      include: {
        supplier: true,
        purchase: {
          include: {
            shoe: true,
          },
        },
      },
    });

    // If payment is linked to a purchase, update the purchase's paidAmount
    if (data.purchaseId) {
      const purchase = await prisma.purchase.findUnique({
        where: { id: data.purchaseId },
        include: {
          payments: true,
        },
      });

      if (purchase) {
        const totalPaid = purchase.payments.reduce((sum, p) => sum + p.amount, 0) + purchase.paidAmount;
        await prisma.purchase.update({
          where: { id: data.purchaseId },
          data: {
            paidAmount: Math.min(totalPaid, purchase.totalCost),
          },
        });
      }
    }

    return payment;
  }

  async updatePayment(id: string, data: UpdateSupplierPaymentInput) {
    const oldPayment = await prisma.supplierPayment.findUnique({
      where: { id },
    });

    const payment = await prisma.supplierPayment.update({
      where: { id },
      data: {
        amount: data.amount,
        paymentDate: data.paymentDate,
        notes: data.notes,
        purchaseId: data.purchaseId,
      },
      include: {
        supplier: true,
        purchase: {
          include: {
            shoe: true,
          },
        },
      },
    });

    // Update purchase paidAmount if linked
    if (oldPayment?.purchaseId) {
      const purchase = await prisma.purchase.findUnique({
        where: { id: oldPayment.purchaseId },
        include: {
          payments: true,
        },
      });

      if (purchase) {
        const totalPaid = purchase.payments.reduce((sum, p) => sum + p.amount, 0) + purchase.paidAmount;
        await prisma.purchase.update({
          where: { id: oldPayment.purchaseId },
          data: {
            paidAmount: Math.min(totalPaid, purchase.totalCost),
          },
        });
      }
    }

    if (data.purchaseId && data.purchaseId !== oldPayment?.purchaseId) {
      const purchase = await prisma.purchase.findUnique({
        where: { id: data.purchaseId },
        include: {
          payments: true,
        },
      });

      if (purchase) {
        const totalPaid = purchase.payments.reduce((sum, p) => sum + p.amount, 0) + purchase.paidAmount;
        await prisma.purchase.update({
          where: { id: data.purchaseId },
          data: {
            paidAmount: Math.min(totalPaid, purchase.totalCost),
          },
        });
      }
    }

    return payment;
  }

  async deletePayment(id: string) {
    const payment = await prisma.supplierPayment.findUnique({
      where: { id },
    });

    const deleted = await prisma.supplierPayment.delete({
      where: { id },
    });

    // Update purchase paidAmount if linked
    if (payment?.purchaseId) {
      const purchase = await prisma.purchase.findUnique({
        where: { id: payment.purchaseId },
        include: {
          payments: true,
        },
      });

      if (purchase) {
        const totalPaid = purchase.payments.reduce((sum, p) => sum + p.amount, 0) + purchase.paidAmount;
        await prisma.purchase.update({
          where: { id: payment.purchaseId },
          data: {
            paidAmount: Math.min(totalPaid, purchase.totalCost),
          },
        });
      }
    }

    return deleted;
  }
}








