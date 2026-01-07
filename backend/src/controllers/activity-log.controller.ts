import { Request, Response } from 'express';
import { ActivityLogService } from '../services/activity-log.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

const activityLogService = new ActivityLogService();

export class ActivityLogController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = Math.min(parseInt(req.query.take as string) || 100, 500);
    
    const filters: any = {};
    if (req.query.userId) filters.userId = req.query.userId as string;
    if (req.query.action) filters.action = req.query.action as string;
    if (req.query.entityType) filters.entityType = req.query.entityType as string;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

    const result = await activityLogService.getLogs(skip, take, filters);
    res.json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const log = await activityLogService.getLogById(id);
    
    if (!log) {
      return res.status(404).json({ error: 'Activity log not found' });
    }
    
    res.json(log);
  });

  getUserActivity = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = Math.min(parseInt(req.query.take as string) || 100, 500);
    
    const result = await activityLogService.getUserActivity(userId, skip, take);
    res.json(result);
  });
}







