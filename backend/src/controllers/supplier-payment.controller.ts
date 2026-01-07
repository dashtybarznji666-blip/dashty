import { Request, Response } from 'express';
import { SupplierPaymentService } from '../services/supplier-payment.service';
import { CreateSupplierPaymentInput, UpdateSupplierPaymentInput } from '../types';

const paymentService = new SupplierPaymentService();

export class SupplierPaymentController {
  async getAllPayments(req: Request, res: Response) {
    try {
      const payments = await paymentService.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentsBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const payments = await paymentService.getPaymentsBySupplier(supplierId);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      const data: CreateSupplierPaymentInput = req.body;
      const payment = await paymentService.createPayment(data);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateSupplierPaymentInput = req.body;
      const payment = await paymentService.updatePayment(id, data);
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await paymentService.deletePayment(id);
      res.json({ message: 'Payment deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}








