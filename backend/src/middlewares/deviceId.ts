import { Request, Response, NextFunction } from 'express';

export const requireDeviceId = (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.header('X-Device-ID');

    if (!deviceId) {
        res.status(401).json({ error: 'Unauthorized', message: 'X-Device-ID header is required' });
        return;
    }

    // Attach deviceId to the request object for downstream use
    (req as any).deviceId = deviceId;
    next();
};

export default requireDeviceId;
