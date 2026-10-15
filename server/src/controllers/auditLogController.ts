import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog.js';

export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { action, entityType, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    if (action && action !== 'all') {
      filter.action = action;
    }
    if (entityType && entityType !== 'all') {
      filter.entityType = entityType;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limitNum),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
