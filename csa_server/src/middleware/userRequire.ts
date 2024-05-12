import { redisClient } from "../redis-source";
import { verify_jwt } from "../utils/user";

const jwt = require('jsonwebtoken');

const userRequireMiddleware = async (req, res, next) => {
    const excludedRoutes = [
        'users/login',
        'users/createuser'
    ];
    console.log('User Conneced', req.ip);

    if (!excludedRoutes.some((route) => req.path.includes(route))) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res
                .status(401)
                .json({ error: 'Authorization token not provided.' });
            }

            const decoded = await verify_jwt(token);

            if (!decoded) {
                return res.status(401).json({ error: 'Invalid token.' });
            }

            const userExists = await redisClient.hGet('users', decoded.username);

            if (!userExists) {
                return res.status(404).json({ error: 'User not found.' });
            }

            req.user = userExists;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        next();
    }
};

export default userRequireMiddleware;