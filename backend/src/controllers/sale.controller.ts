import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';
import { CreateSaleInput } from '../types';
import { logError, logDebug } from '../lib/logger';

const saleService = new SaleService();

export class SaleController {
  async getAllSales(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500); // Max 500 items per request
      const sales = await saleService.getAllSales(skip, take);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSaleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sale = await saleService.getSaleById(id);
      res.json(sale);
    } catch (error: any) {
      if (error.message === 'Sale not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getTodaySales(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500);
      const sales = await saleService.getTodaySales(skip, take);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOnlineSales(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500);
      const sales = await saleService.getOnlineSales(skip, take);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSale(req: Request, res: Response) {
    try {
      const data = req.body as CreateSaleInput;
      const userId = req.user?.userId; // Get userId from authenticated request
      logDebug('Creating sale', { data, userId });
      const sale = await saleService.createSale(data, userId);
      
      // Log activity
      if (req.user && 'shoe' in sale && sale.shoe) {
        const { logActivity } = await import('../lib/activity-logger');
        await logActivity(req.user.userId, 'create_sale', 'sale', {
          entityId: sale.id,
          description: `Created sale: ${sale.quantity}x ${sale.shoe.name} (${sale.size})`,
          metadata: { 
            shoeId: sale.shoeId, 
            quantity: sale.quantity, 
            totalPrice: sale.totalPrice,
            profit: sale.profit 
          },
          req,
        });
      }
      
      res.status(201).json(sale);
    } catch (error: any) {
      logError('Error creating sale', error, { stack: error.stack });
      
      if (error.message === 'Stock not found for this shoe and size' || 
          error.message === 'Insufficient stock' ||
          error.message === 'Shoe not found') {
        return res.status(400).json({ error: error.message });
      }
      
      // Return proper JSON error response
      res.status(500).json({ 
        error: error.message || 'Failed to create sale',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async getSalesStats(req: Request, res: Response) {
    try {
      const stats = await saleService.getSalesStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAllSales(req: Request, res: Response) {
    try {
      const result = await saleService.deleteAllSales();
      res.json({ 
        message: `Successfully deleted ${result.deletedCount} sales`,
        deletedCount: result.deletedCount 
      });
    } catch (error: any) {
      logError('Error deleting all sales', error);
      res.status(500).json({ error: error.message || 'Failed to delete sales' });
    }
  }

  async deleteAllShippingSales(req: Request, res: Response) {
    try {
      const result = await saleService.deleteAllShippingSales();
      res.json({ 
        message: `Successfully deleted ${result.deletedCount} shipping sales`,
        deletedCount: result.deletedCount 
      });
    } catch (error: any) {
      logError('Error deleting all shipping sales', error);
      res.status(500).json({ error: error.message || 'Failed to delete shipping sales' });
    }
  }

  async deleteSale(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const sale = await saleService.deleteSale(id);
      res.json({ 
        message: 'Sale deleted successfully',
        sale 
      });
    } catch (error: any) {
      if (error.message === 'Sale not found') {
        return res.status(404).json({ error: error.message });
      }
      logError('Error deleting sale', error);
      res.status(500).json({ error: error.message || 'Failed to delete sale' });
    }
  }

  async getSalesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500);
      
      // Check authorization: users can only view their own sales unless they're admin
      if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own sales' });
      }
      
      const sales = await saleService.getSalesByUser(userId, skip, take);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserSalesStats(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // Check authorization: users can only view their own stats unless they're admin
      if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own sales statistics' });
      }
      
      const stats = await saleService.getUserSalesStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}


