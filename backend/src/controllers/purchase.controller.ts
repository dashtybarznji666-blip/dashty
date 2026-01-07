import { Request, Response } from 'express';
import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseInput, UpdatePurchaseInput } from '../types';

const purchaseService = new PurchaseService();

export class PurchaseController {
  async getAllPurchases(req: Request, res: Response) {
    try {
      const purchases = await purchaseService.getAllPurchases();
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPurchasesBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const purchases = await purchaseService.getPurchasesBySupplier(supplierId);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPurchaseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchase = await purchaseService.getPurchaseById(id);
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPurchaseBalance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const balance = await purchaseService.getPurchaseBalance(id);
      res.json(balance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCreditPurchases(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const purchases = await purchaseService.getCreditPurchases(supplierId);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPurchase(req: Request, res: Response) {
    try {
      const data: CreatePurchaseInput = req.body;
      const purchase = await purchaseService.createPurchase(data);
      res.status(201).json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdatePurchaseInput = req.body;
      const purchase = await purchaseService.updatePurchase(id, data);
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deletePurchase(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await purchaseService.deletePurchase(id);
      res.json({ message: 'Purchase deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTodosGroupedBySupplier(req: Request, res: Response) {
    try {
      const todos = await purchaseService.getTodosGroupedBySupplier();
      res.json(todos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsTodo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchase = await purchaseService.markAsTodo(id);
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsDone(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchase = await purchaseService.markAsDone(id);
      res.json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}


