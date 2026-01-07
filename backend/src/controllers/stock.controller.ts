import { Request, Response } from 'express';
import { StockService } from '../services/stock.service';
import { AddStockInput, BulkAddStockInput } from '../types';

const stockService = new StockService();

export class StockController {
  async getAllStock(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500); // Max 500 items per request
      const stock = await stockService.getAllStock(skip, take);
      res.json(stock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStockByShoeId(req: Request, res: Response) {
    try {
      const { shoeId } = req.params;
      const stock = await stockService.getStockByShoeId(shoeId);
      res.json(stock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async addStock(req: Request, res: Response) {
    try {
      const data = req.body as AddStockInput;
      const stock = await stockService.addStock(data);
      res.status(201).json(stock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async bulkAddStock(req: Request, res: Response) {
    try {
      const { shoeId, stockEntries } = req.body as BulkAddStockInput;
      if (!shoeId || !stockEntries || !Array.isArray(stockEntries)) {
        return res.status(400).json({ error: 'Invalid request. shoeId and stockEntries array are required.' });
      }
      const results = await stockService.bulkAddStock(shoeId, stockEntries);
      res.status(201).json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const stock = await stockService.updateStock(id, quantity);
      res.json(stock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLowStock(req: Request, res: Response) {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;
      const lowStock = await stockService.getLowStockItems(threshold);
      res.json(lowStock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stock = await stockService.deleteStock(id);
      res.json(stock);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}


