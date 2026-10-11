import { Request, Response, NextFunction } from 'express';
import { verifyToken, COOKIE_NAME, JwtPayload } from '../utils/token.js';
import { User, UserRole } from '../models/User.js';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Extract from cookie or Bearer header
  let token = req.cookies?.[COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this resource.',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
    return;
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]. Your role is '${req.user.role}'.`,
      });
      return;
    }

    next();
  };
}
