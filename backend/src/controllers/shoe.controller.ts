import { Request, Response } from 'express';
import { ShoeService } from '../services/shoe.service';
import { CreateShoeInput, UpdateShoeInput } from '../types';
import { logActivity } from '../lib/activity-logger';

const shoeService = new ShoeService();

export class ShoeController {
  async getAllShoes(req: Request, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = Math.min(parseInt(req.query.take as string) || 100, 500); // Max 500 items per request
      const shoes = await shoeService.getAllShoes(skip, take);
      res.json(shoes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getShoeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shoe = await shoeService.getShoeById(id);
      if (!shoe) {
        return res.status(404).json({ error: 'Shoe not found' });
      }
      res.json(shoe);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createShoe(req: Request, res: Response) {
    try {
      const data = req.body as CreateShoeInput;
      const shoe = await shoeService.createShoe(data);
      
      // Log activity
      if (req.user) {
        await logActivity(req.user.userId, 'create_shoe', 'shoe', {
          entityId: shoe.id,
          description: `Created shoe: ${shoe.name} (SKU: ${shoe.sku})`,
          metadata: { sku: shoe.sku, brand: shoe.brand, category: shoe.category },
          req,
        });
      }
      
      res.status(201).json(shoe);
    } catch (error: any) {
      if (error.message === 'SKU already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async updateShoe(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateShoeInput;
      const shoe = await shoeService.updateShoe(id, data);
      
      // Log activity
      if (req.user) {
        await logActivity(req.user.userId, 'update_shoe', 'shoe', {
          entityId: shoe.id,
          description: `Updated shoe: ${shoe.name} (SKU: ${shoe.sku})`,
          metadata: { sku: shoe.sku, changes: Object.keys(data) },
          req,
        });
      }
      
      res.json(shoe);
    } catch (error: any) {
      if (error.message === 'SKU already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteShoe(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Get shoe info before deletion for logging
      const shoe = await shoeService.getShoeById(id);
      await shoeService.deleteShoe(id);
      
      // Log activity
      if (req.user && shoe) {
        await logActivity(req.user.userId, 'delete_shoe', 'shoe', {
          entityId: id,
          description: `Deleted shoe: ${shoe.name} (SKU: ${shoe.sku})`,
          metadata: { sku: shoe.sku },
          req,
        });
      }
      
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}


