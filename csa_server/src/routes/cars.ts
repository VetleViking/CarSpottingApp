import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { verify_jwt } from '../utils/user';

const router = Router();

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

router.get('/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

        const filteredMakes = makesArray.filter(make => make.toLowerCase().includes(query.toLowerCase()));

        res.status(200).json(filteredMakes);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // if not searched bofore, save search and get from apininja instead
        const searchedBefore = await redisClient.hGet(`searched:unknown`, ' ');

        if (!searchedBefore) {
            await redisClient.hSet(`searched:unknown`, ' ', ' ');
        
            const params = new URLSearchParams();
            params.append('model', 'a');
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

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${model.make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

        let modelsArray: {make: string, model: string}[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);    
            const models = Object.keys(modelsObject).map(key => modelsObject[key]);
        
            const modelsWithMake = models.map(model => ({make, model}));
        
            modelsArray = modelsArray.concat(modelsWithMake);
        
            if (modelsArray.length > 50) {
                break;
            }
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

            const makesObject = await redisClient.hGetAll('makes');
            const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

            uniqueModels.forEach(async model => {
                const make = makesArray.find(make => make.toLowerCase() === model.make.toLowerCase()) || 'other';
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const makesObject = await redisClient.hGetAll('makes');
        const makesArray = Object.keys(makesObject).map(key => makesObject[key]);
        makesArray.push('other');

        let modelsArray: {make: string, model: string}[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);    
            const models = Object.keys(modelsObject).map(key => modelsObject[key]);
        
            const filteredModels = models.filter(model => model.toLowerCase().includes(query.toLowerCase()));
        
            const modelsWithMake = filteredModels.map(model => ({make, model}));
        
            modelsArray = modelsArray.concat(modelsWithMake);
        
            if (modelsArray.length > 50) {
                break;
            }
        }
        
        res.status(200).json(modelsArray);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        
        // if not searched bofore, save search and get from apininja instead
        const searchedBefore = await redisClient.hGet(`searched:${make}`, ' ');

        if (!searchedBefore) {
            await redisClient.hSet(`searched:${make}`, ' ', ' ');
        
            const params = new URLSearchParams();
            params.append('make', make);
            params.append('model', 'a');
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

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({make, model: modelsObject[key]}));

        if (modelsArray.length > 50) {
            res.status(200).json(modelsArray.slice(0, 50));
            return;
        }

        res.status(200).json(modelsArray);
        return;

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

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({make, model: modelsObject[key]}));

        const filteredModels = modelsArray.filter(model => model.model.toLowerCase().includes(query.toLowerCase()));

        if (filteredModels.length > 50) {
            res.status(269).json(filteredModels.slice(0, 50));
            return;
        }

        res.status(269).json(filteredModels);
        return;
        
    } catch(err) {
        next(err);
    }
});

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/addspot', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model } = req.body;
        const image = req.file;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        if (!make || !model || !image) {
            res.status(400).json({ message: 'Make, model, and image are required' });
            return;
        }

        const allSpots = await redisClient.hGetAll(`spots:${decodedUser.username}:${make}:${model}`);

        const offset = Object.keys(allSpots).length;

        const imageBase64 = image.buffer.toString('base64');

        await redisClient.hSet(`spots:${decodedUser.username}:${make}:${model}`, 'image' + offset, imageBase64);

        res.status(201).json({ message: 'Spot added' });
    } catch(err) {
        next(err);
    }
});

router.get('/getspots/:make/:model', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model } = req.params;
        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        if (!make || !model) {
            res.status(400).json({ message: 'Make and model are required' });
            return;
        }

        const allSpots = await redisClient.hGetAll(`spots:${username || decodedUser.username}:${make}:${model}`);

        console.log(allSpots);

        const images = [];
        for (const key in allSpots) {
            if (key.startsWith('image')) {
                const imageBase64 = allSpots[key];
                const imageBuffer = Buffer.from(imageBase64, 'base64');
                images.push({ key, image: imageBuffer });
            }
        }

        res.status(200).json(images);
    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);

        res.status(200).json(makesArray);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = Object.keys(keys).map(key => key.split(':')[2]);

        const filteredMakes = makesArray.filter(make => make.toLowerCase().includes((query as string).toLowerCase()));

        res.status(200).json(filteredMakes);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);
           
        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys.map(key => key.split(':')[3]);

        const combinedArray = modelsArray.map((model, index) => ({make: makesArray[index], model}));

        res.status(200).json(combinedArray);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys.map(key => key.split(':')[3]);

        const filteredModels = modelsArray.filter(model => model.toLowerCase().includes((query as string).toLowerCase()));

        const combinedArray = filteredModels.map((model, index) => ({make: makesArray[index], model}));

        res.status(200).json(combinedArray);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;

        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const modelsArray = keys.map(key => key.split(':')[3]);

        const combinedArray = modelsArray.map(model => ({make, model}));

        res.status(200).json(combinedArray);
        return;

    } catch(err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;

        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const modelsArray = keys.map(key => key.split(':')[3]);

        const filteredModels = modelsArray.filter(model => model.toLowerCase().includes((query as string).toLowerCase()));

        const combinedArray = filteredModels.map(model => ({make, model}));

        res.status(200).json(combinedArray);
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
