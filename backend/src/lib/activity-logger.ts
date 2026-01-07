import { Request } from 'express';
import { ActivityLogService, CreateActivityLogInput } from '../services/activity-log.service';

const activityLogService = new ActivityLogService();

/**
 * Helper function to get client IP address from request
 */
function getClientIp(req: Request): string | undefined {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.socket.remoteAddress ||
    undefined
  );
}

/**
 * Log an activity
 */
export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  options?: {
    entityId?: string;
    description?: string;
    metadata?: Record<string, any>;
    req?: Request;
  }
) {
  try {
    const logData: CreateActivityLogInput = {
      userId,
      action,
      entityType,
      entityId: options?.entityId,
      description: options?.description,
      metadata: options?.metadata,
    };

    if (options?.req) {
      logData.ipAddress = getClientIp(options.req);
      logData.userAgent = options.req.headers['user-agent'];
    }

    await activityLogService.createLog(logData);
  } catch (error) {
    // Don't throw - activity logging should not break the main flow
    console.error('Failed to log activity:', error);
  }
}







