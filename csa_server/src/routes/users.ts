import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch(err) {
        next(err);
    }
});

export default router;
