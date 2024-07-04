import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Définir l'interface pour les données utilisateur dans le token
interface DecodedToken {
    userId: string;
    email: string;
}

// Ajouter les propriétés personnalisées à l'interface Request
declare module 'express-serve-static-core' {
    interface Request {
        userConnected?: {
            id: string;
            role: string;
        };
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('x-auth-token');
    console.log(token);
    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.userConnected = { id: decoded.userId, role: decoded.email };
        console.log(req.userConnected);
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: true, message: 'Token expired. Please log in again.' });
        } else {
            return res.status(401).json({ error: true, msg: 'Token is not valid' });
        }
    }
};

export default authMiddleware;
