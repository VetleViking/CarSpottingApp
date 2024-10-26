import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { generate_jwt, get_user, verify_jwt } from '../utils/user';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        if (userExists !== password) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        res.status(200).json({ message: 'Logged in', token: await generate_jwt(username) });
    } catch(err) {
        next(err);
    }
});

import { parse, serialize } from 'cookie';
//import bcrypt from 'bcrypt';

router.post('/login_new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        //const isPasswordValid = await bcrypt.compare(password, userExists); not using bcrypt yet
        const isPasswordValid = userExists === password;
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = await generate_jwt(username);

        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: true, // Set to true if served over HTTPS
            maxAge: 60 * 60 * 24 * 31, // 1 month expiration
            sameSite: 'none',
            page: '.vest.li', // Cookie is accessible on all subdomains
            path: '/', // Cookie is accessible on all routes
        });

        res.setHeader('Set-Cookie', cookie);

        res.status(200).json({ message: 'Logged in' });

    } catch (err) {
        next(err);
    }
});

router.get('/get_username_new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');

        const token = cookies.auth_token;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const decoded = await verify_jwt(token);

        res.status(200).json({ username: decoded.username });
    } catch(err) {
        next(err);
    }
});

router.post('/create_user_new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        await redisClient.hSet('users', username, password);

        res.status(201).json({ message: 'User created' });
    } catch(err) {
        next(err);
    }
});

router.post('/deleteuser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        // find all keys that belong to user and delete them
        const userPatterns = [`makes:${username}:*`, `spots:${username}:*`];
        let keysToDelete = [];
      
        for (const pattern of userPatterns) {
          const keys = await redisClient.keys(pattern);
          keysToDelete = [...keysToDelete, ...keys];
        }
      
        if (keysToDelete.length > 0) {
          const deletePromises = keysToDelete.map(key => redisClient.del(key));
          await Promise.all(deletePromises);
        }
      
        // delete user and makes added by user
        await redisClient.hDel('users', username);
        await redisClient.del(`makes:${username}`);

        res.status(200).json({ message: 'User deleted' });
    } catch(err) {
        next(err);
    }
});

router.get('/checkadmin/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        const isAdmin = await redisClient.hGet('admins', username) ? true : username === 'Vetle';
        res.status(200).json({ is_admin: isAdmin });
    } catch(err) {
        next(err);
    }
});

router.get('/check_admin_new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');

        const token = cookies.auth_token;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const username = await get_user(token);
        const userExists = await redisClient.hGet('users', username);

        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        const isAdmin = await redisClient.hGet('admins', username) ? true : username === 'Vetle';
        res.status(200).json({ is_admin: isAdmin });
    } catch(err) {
        next(err);
    }
});

router.get('/get_stats/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params;

        const userExists = await redisClient.hGet('users', username);
        if (!userExists) {
            res.status(400).json({ message: 'User does not exist' });
            return;
        }

        // find all spots that belong to user
        const keys = await redisClient.keys(`spots:${username}:*`);

        res.status(200).json({ total_spots: keys.length });
    } catch(err) {
        next(err);
    }
});

router.post('/decodejwt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const decoded = await verify_jwt(token);

        res.status(200).json(decoded.username);
    } catch(err) {
        next(err);
    }
});

export default router;
