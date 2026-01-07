import prisma from '../lib/prisma';

export class ExchangeRateService {
  async getCurrentRate() {
    const rate = await prisma.exchangeRate.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Default rate if none exists (1 USD = 1300 IQD)
    return rate?.rate || 1300;
  }

  async setRate(rate: number) {
    if (rate <= 0) {
      throw new Error('Exchange rate must be greater than 0');
    }

    // Get the latest rate
    const latest = await prisma.exchangeRate.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    if (latest && latest.rate === rate) {
      // Rate hasn't changed, just return it
      return latest;
    }

    // Create a new rate entry
    return prisma.exchangeRate.create({
      data: { rate },
    });
  }

  async getRateHistory() {
    return prisma.exchangeRate.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50, // Last 50 rate changes
    });
  }
}

