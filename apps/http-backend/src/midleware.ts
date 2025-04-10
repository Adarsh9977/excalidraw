import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';

interface JWTPayload {
    userId: string;
}

declare module 'express' {
    interface Request {
        userId?: string;
    }
}

export const middleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  try {
    // Remove 'Bearer ' prefix if present
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = (decoded as any).userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const config = {
    matcher: '',
};