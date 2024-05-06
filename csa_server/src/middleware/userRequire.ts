import { redisClient } from "../redis-source";

const jwt = require('jsonwebtoken');

const userRequireMiddleware = async (req, res, next) => {
  const excludedRoutes = [
    'api/v1/users/login',
    'api/v1/users/createuser',
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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token.' });
      }

      const userExists = await redisClient.hGet('users', decoded);

      if (!userExists) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const user = JSON.parse(userExists);

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    next();
  }
};

export default userRequireMiddleware;