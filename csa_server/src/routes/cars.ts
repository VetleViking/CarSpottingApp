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

router.get('/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        // if not searched bofore, save search and get from apininja instead
        const searchedBefore = await redisClient.hGet('searched:unknown', query);

        if (!searchedBefore) {
            await redisClient.hSet('searched:unknown', query, query);
        
            const params = new URLSearchParams();
            params.append('model', query);
            if (query.length == 0) params.append('model', 'a');
            params.append('limit', '50');
        
            const response = await fetch(`https://api.api-ninjas.com/v1/cars` + '?' + params.toString(), {
                headers: {
                    'X-Api-Key': `9UKQbcg6KLGBNFl1N0I2Kw==pvGsAwuxi8RToxzi`
                }
            });
        
            const data = await response.json();
        
            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            if (uniqueModels.length === 0) {
                res.status(404).json({ message: 'No models found' });
                return;
            }

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${model.make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
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

router.get('/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;
        
        // if not searched bofore, save search and get from apininja instead
        const searchedBefore = await redisClient.hGet(`searched:${make}`, query);

        if (!searchedBefore) {
            await redisClient.hSet(`searched:${make}`, query, query);
        
            const params = new URLSearchParams();
            params.append('make', make);
            params.append('model', query);
            if (query.length == 0) params.append('model', 'a');
            params.append('limit', '50');
        
            const response = await fetch(`https://api.api-ninjas.com/v1/cars` + '?' + params.toString(), {
                headers: {
                    'X-Api-Key': `9UKQbcg6KLGBNFl1N0I2Kw==pvGsAwuxi8RToxzi`
                }
            });
        
            const data = await response.json();
        
            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            if (uniqueModels.length === 0) {
                res.status(404).json({ message: 'No models found' });
                return;
            }

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => modelsObject[key]);

        const filteredModels = modelsArray.filter(model => model.includes(query));

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
