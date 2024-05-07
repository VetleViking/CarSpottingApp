import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';

const router = Router();

router.get('/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

        const filteredMakes = makesArray.filter(make => make.includes(query));

        res.status(200).json(filteredMakes);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

        res.status(200).json(makesArray);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;
        
        const modelsObject = await redisClient.hGet(`make:${make}`, query);
        const modelsArray = Object.keys(modelsObject).map(key => modelsObject[key]);

        if (modelsArray.length === 0) {
            res.status(404).json({ message: 'No models found' });
            return;
        }

        res.status(200).json(modelsArray);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

        let modelsArray: string[] = [];

        makesArray.forEach(async make => {
            const modelsObject = await redisClient.hGet(`make:${make}`, query);
        
            const models = Object.keys(modelsObject).map(key => modelsObject[key]);
            modelsArray = modelsArray.concat(models);
        });

        if (modelsArray.length === 0) {
            res.status(404).json({ message: 'No models found' });
            return;
        }

        res.status(200).json(modelsArray);

    } catch(err) {
        next(err);
    }
});

router.post('/makes/:make', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        
        const alreadyExists = await redisClient.hGet('makes', make);

        if (alreadyExists) {
            res.status(400).json({ message: 'Make already exists' });
            return;
        }

        await redisClient.hSet('makes', make, make);

        res.status(201).json({ message: 'Make created' });
        return;

    } catch(err) {
        next(err);
    }
});

export default router;
