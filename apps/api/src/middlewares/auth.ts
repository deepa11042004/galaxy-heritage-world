import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { AppError } from './error.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = '';

    // Read Bearer token or HTTP-only cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.ghw_access_token) {
      token = req.cookies.ghw_access_token;
    }

    if (!token) {
      throw new AppError('Authentication required. Please sign in.', 401);
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or account is deactivated.', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles.map((ur: any) => ur.role.name),
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Token has expired. Please refresh your session.', 401));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please sign in again.', 401));
    } else {
      next(error);
    }
  }
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const hasRole = req.user.roles.some(
      (r) => allowedRoles.includes(r) || r === 'SUPER_ADMIN'
    );

    if (!hasRole) {
      return next(
        new AppError('Forbidden. You lack permission for this operation.', 403)
      );
    }

    next();
  };
}
