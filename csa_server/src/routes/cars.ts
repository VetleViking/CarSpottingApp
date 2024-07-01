import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { verify_jwt } from '../utils/user';
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.get('/makes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                          .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

        res.status(200).json(makesArray);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                          .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

        const filteredMakes = makesArray.filter(make => make.toLowerCase().includes(query.toLowerCase()));

        res.status(200).json(filteredMakes);
        return;
        
    } catch(err) {
        next(err);
    }
});

router.get('/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        // if not searched bofore, save search and get from apininja instead
        const searchedBefore = await redisClient.hGet(`searched:unknown`, ' ');

        if (!searchedBefore) {
            await redisClient.hSet(`searched:unknown`, ' ', ' ');
        
            const params = new URLSearchParams();
            params.append('model', 'a');
            params.append('limit', '50');
        
            const response = await fetch(`https://api.api-ninjas.com/v1/cars` + '?' + params.toString(), {
                headers: {
                    'X-Api-Key': process.env.API_NINJAS_KEY
                }
            });
        
            const data = await response.json();
        
            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            const makesObject = await redisClient.hGetAll('makes');
            const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
            const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                            .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

            uniqueModels.forEach(async model => {
                const make = makesArray.find(make => make.toLowerCase() === model.make.toLowerCase()) || 'other';
                model.make = make;
                redisClient.hSet(`make:${model.make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                          .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

        let modelsArray: {make: string, model: string}[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);    
            const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
            const models = Object.keys(modelsObject).map(key => modelsObject[key])
                          .concat(Object.keys(modelsObjectUser).map(key => modelsObjectUser[key]));
        
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
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

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
                    'X-Api-Key': process.env.API_NINJAS_KEY
                }
            });
        
            const data = await response.json();
        
            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            const makesObject = await redisClient.hGetAll('makes');
            const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
            const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                            .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

            uniqueModels.forEach(async model => {
                const make = makesArray.find(make => make.toLowerCase() === model.make.toLowerCase()) || 'other';
                model.make = make;
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
                          .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));
        makesArray.push('other');

        let modelsArray: {make: string, model: string}[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);    
            const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
            const models = Object.keys(modelsObject).map(key => modelsObject[key])
                          .concat(Object.keys(modelsObjectUser).map(key => modelsObjectUser[key]));
        
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
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
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
                    'X-Api-Key': process.env.API_NINJAS_KEY
                }
            });
        
            const data = await response.json();
        
            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            uniqueModels.forEach(async model => {
                model.make = make;
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({make, model: modelsObject[key]}))
                            .concat(Object.keys(modelsObjectUser).map(key => ({make, model: modelsObjectUser[key]})));


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

        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
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
                    'X-Api-Key': process.env.API_NINJAS_KEY
                }
            });
        
            const data = await response.json();

            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.model === item.model
                ))
            );

            uniqueModels.forEach(async model => {
                model.make = make;
                redisClient.hSet(`make:${make}`, model.model, model.model);
            });

            res.status(200).json(uniqueModels);
            return;
        }

        // Else, get all makes from Redis
        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({make, model: modelsObject[key]}))
                            .concat(Object.keys(modelsObjectUser).map(key => ({make, model: modelsObjectUser[key]})));

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

router.get('/spots/:make/percentage', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({make, model: modelsObject[key]}))
                            .concat(Object.keys(modelsObjectUser).map(key => ({make, model: modelsObjectUser[key]})));

        const spotsKeys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const percentage = Math.floor(spotsKeys.length / modelsArray.length * 100);


        res.status(200).json({ percentage: percentage, numSpots: spotsKeys.length, numModels: modelsArray.length });
    } catch(err) {
        next(err);
    }
});

router.post('/addmake', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        const alreadyExists = await redisClient.hGet('makes', make);
        const alreadyExistsUser = await redisClient.hGet(`makes:${decodedUser.username}`, make);

        if (alreadyExists || alreadyExistsUser) {
            res.status(400).json({ message: 'Make already exists' });
            return;
        }

        await redisClient.hSet(`makes:${decodedUser.username}`, make, make);

        res.status(201).json({ message: 'Make created' });
        return;

    } catch(err) {
        next(err);
    }
});

router.post('/addmodel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        const alreadyExists = await redisClient.hGet(`makes:${decodedUser.username}:${make}`, model);

        if (alreadyExists) {
            res.status(400).json({ message: 'Model already exists' });
            return;
        }

        await redisClient.hSet(`makes:${decodedUser.username}:${make}`, model, model);

        res.status(201).json({ message: 'Model created' });
        return;

    } catch(err) {
        next(err);
    }
});

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/addspot', upload.array('images', 10), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, notes, date } = req.body;
        const images = req.files as Express.Multer.File[];
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);
        
        if (!make || !model || images.length === 0) {
            res.status(400).json({ message: 'Make, model, and at least one image are required' });
            return;
        }

        const allSpots = await redisClient.hGetAll(`spots:${decodedUser.username}:${make}:${model}`);

        let offset = 0;

        Object.keys(allSpots).forEach(key => {
            const match = key.match(/0image(\d+)/) || key.match(/image(\d+)/);
            if (match) {
                const number = parseInt(match[1], 10); 
                if (number > offset) {
                    offset = number; 
                }
            }
        });

        offset++;

        const imagesBase64 = images.map(image => image.buffer.toString('base64'));

        const data: Record<string, string> = {
            [`notes${offset}`]: notes,
            [`date${offset}`]: date,
        };

        imagesBase64.forEach((item, index) => {
            data[`${index}image${offset}`] = item;
        });

        if (!notes) delete data[`notes${offset}`];
        if (!date) delete data[`date${offset}`];

        await redisClient.hSet(`spots:${decodedUser.username}:${make}:${model}`, data);

        res.status(201).json({ message: 'Spot added' });
    } catch (err) {
        next(err);
    }
});

router.post('/deletespot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        if (!make || !model || (key === undefined || key === null)) {
            res.status(400).json({ message: 'Make, model, and key are required' });
            return;
        }

        const spotKeyPrefix = `spots:${decodedUser.username}:${make}:${model}`;
        const allSpots = await redisClient.hGetAll(spotKeyPrefix);

        const imageKeys = Object.keys(allSpots).filter(k => k.endsWith(`image${key}`));
        const spotNotesKey = `notes${key}`;
        const spotDateKey = `date${key}`;

        if (imageKeys.length === 0 && !allSpots[spotNotesKey] && !allSpots[spotDateKey]) {
            res.status(404).json({ message: 'Spot not found' });
            return;
        }

        const keysToDelete = imageKeys;
        if (allSpots[spotNotesKey]) keysToDelete.push(spotNotesKey);
        if (allSpots[spotDateKey]) keysToDelete.push(spotDateKey);

        await redisClient.hDel(spotKeyPrefix, keysToDelete);

        res.status(200).json({ message: 'Spot deleted' });
    } catch (err) {
        next(err);
    }
});

const sharp = require('sharp');

const compressImage = async (base64Image) => {
    const buffer = Buffer.from(base64Image, 'base64');
    const compressedBuffer = await sharp(buffer)
        .rotate() 
        .resize(800) 
        .jpeg({ quality: 80 }) 
        .toBuffer();
    return compressedBuffer.toString('base64'); 
};

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

        const imageKeys = Object.keys(allSpots).filter(key => key.match(/^(\d*)image\d+$/));

        imageKeys.sort((a, b) => {
            const [aImageNum, aSpotNum] = a.match(/^(\d*)image(\d+)$/).slice(1).map(Number);
            const [bImageNum, bSpotNum] = b.match(/^(\d*)image(\d+)$/).slice(1).map(Number);
            return aSpotNum === bSpotNum ? aImageNum - bImageNum : aSpotNum - bSpotNum;
        });

        const spots = {};
        
        for (const imageKey of imageKeys) {
            const [imageNum, spotNum] = imageKey.match(/^(\d*)image(\d+)$/).slice(1).map(Number);

            if (!spots[spotNum]) {
                spots[spotNum] = {
                    images: [],
                    notes: allSpots[`notes${spotNum}`],
                    date: allSpots[`date${spotNum}`],
                };
            }

            let imageBase64 = allSpots[imageKey];
            if (imageBase64) {
                imageBase64 = await compressImage(imageBase64);
            }

            spots[spotNum].images.push({ key: imageNum, image: imageBase64 });
        }

        const spotArray = Object.keys(spots).map(spotNum => ({
            key: spotNum,
            ...spots[spotNum],
        }));

        res.status(200).json(spotArray);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]).filter((item, index, self) => self.indexOf(item) === index);

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

        const makesArray = keys.map(key => key.split(':')[2]).filter((item, index, self) => self.indexOf(item) === index);

        const filteredMakes = Array.from(makesArray).filter(make => make.toLowerCase().includes((query as string).toLowerCase()));

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

router.post('/updatespots', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = await verify_jwt(token);

        const is_admin = await redisClient.hGet('admins', decodedUser.username) ? true : decodedUser.username === 'Vetle';

        if (!is_admin) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const users = await redisClient.hGetAll('users');

        for (const user of Object.keys(users)) {
            const keys = await redisClient.keys(`spots:${user}:*`);

            for (const key of keys) {
                const allSpots = await redisClient.hGetAll(key);

                for (const spotKey of Object.keys(allSpots)) {
                    if (spotKey.startsWith('image')) {
                        const index = spotKey.match(/image(\d+)/)[1];
                        const spot = allSpots[spotKey];

                        await redisClient.hDel(key, spotKey);
                        await redisClient.hSet(key, `0image${index}`, spot);
                    }
                }
            }
        }

        res.status(200).json({ message: 'Spots updated' });
    } catch (err) {
        next(err);
    }
});

export default router;
