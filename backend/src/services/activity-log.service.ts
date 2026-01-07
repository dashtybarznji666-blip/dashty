import prisma from '../lib/prisma';

export interface CreateActivityLogInput {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogService {
  async createLog(data: CreateActivityLogInput) {
    return prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });
  }

  async getLogs(skip: number = 0, take: number = 100, filters?: {
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    if (filters?.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
              role: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return {
      logs: logs.map(log => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
      })),
      total,
      skip,
      take,
    };
  }

  async getLogById(id: string) {
    const log = await prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    if (!log) {
      return null;
    }

    return {
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
    };
  }

  async getUserActivity(userId: string, skip: number = 0, take: number = 100) {
    return this.getLogs(skip, take, { userId });
  }
}







