import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierInput, UpdateSupplierInput } from '../types';
import { logError, logDebug } from '../lib/logger';

const supplierService = new SupplierService();

export class SupplierController {
  async getAllSuppliers(req: Request, res: Response) {
    try {
      const suppliers = await supplierService.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupplierById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const supplier = await supplierService.getSupplierById(id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupplierWithBalance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const supplier = await supplierService.getSupplierWithBalance(id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupplierBalance(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const balance = await supplierService.getSupplierBalance(id);
      res.json(balance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSupplier(req: Request, res: Response) {
    try {
      const data: CreateSupplierInput = req.body;
      logDebug('Creating supplier', { data });
      const supplier = await supplierService.createSupplier(data);
      res.status(201).json(supplier);
    } catch (error: any) {
      logError('Error creating supplier', error, { stack: error.stack });
      res.status(500).json({ 
        error: error.message || 'Failed to create supplier',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async updateSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateSupplierInput = req.body;
      const supplier = await supplierService.updateSupplier(id, data);
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await supplierService.deleteSupplier(id);
      res.json({ message: 'Supplier deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

