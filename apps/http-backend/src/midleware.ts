import { NextFunction, Response, Request } from 'express';
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

export function middleware(req: Request, res: Response,next: NextFunction) {
    const token = req.headers['authorization'] ?? "";
    if(!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if(decoded) {
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized' });
    }
}

export const config = {
    matcher: '',
};