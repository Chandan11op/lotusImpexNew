import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/env.js';
import { UserRole } from '../models/User.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

const COOKIE_NAME = 'lotus_auth_token';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'strict' : 'lax',
    path: '/',
  });
}

export { COOKIE_NAME };
