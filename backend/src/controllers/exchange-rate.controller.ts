import { Request, Response } from 'express';
import { ExchangeRateService } from '../services/exchange-rate.service';

const exchangeRateService = new ExchangeRateService();

export class ExchangeRateController {
  async getCurrentRate(req: Request, res: Response) {
    try {
      const rate = await exchangeRateService.getCurrentRate();
      res.json({ rate });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async setRate(req: Request, res: Response) {
    try {
      const { rate } = req.body;
      if (!rate || typeof rate !== 'number') {
        return res.status(400).json({ error: 'Rate is required and must be a number' });
      }
      const exchangeRate = await exchangeRateService.setRate(rate);
      res.json(exchangeRate);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRateHistory(req: Request, res: Response) {
    try {
      const history = await exchangeRateService.getRateHistory();
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

