import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { get_user, verify_jwt } from '../utils/user';
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

const router = Router();

router.get('/makes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
            .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

        res.status(200).json(makesArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const makesObject = await redisClient.hGetAll('makes');
        const makesObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}`);
        const makesArray = Object.keys(makesObject).map(key => makesObject[key])
            .concat(Object.keys(makesObjectUser).map(key => makesObjectUser[key]));

        const filteredMakes = makesArray.filter(make => make.toLowerCase().includes(query.toLowerCase()));

        res.status(200).json(filteredMakes);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

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

        let modelsArray: { make: string, model: string }[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);
            const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
            const models = Object.keys(modelsObject).map(key => modelsObject[key])
                .concat(Object.keys(modelsObjectUser).map(key => modelsObjectUser[key]));

            const modelsWithMake = models.map(model => ({ make, model }));

            modelsArray = modelsArray.concat(modelsWithMake);

            if (modelsArray.length > 50) {
                break;
            }
        }

        res.status(200).json(modelsArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

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

        let modelsArray: { make: string, model: string }[] = [];

        for (const make of makesArray) {
            const modelsObject = await redisClient.hGetAll(`make:${make}`);
            const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
            const models = Object.keys(modelsObject).map(key => modelsObject[key])
                .concat(Object.keys(modelsObjectUser).map(key => modelsObjectUser[key]));

            const filteredModels = models.filter(model => model.toLowerCase().includes(query.toLowerCase()));

            const modelsWithMake = filteredModels.map(model => ({ make, model }));

            modelsArray = modelsArray.concat(modelsWithMake);

            if (modelsArray.length > 50) {
                break;
            }
        }

        res.status(200).json(modelsArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

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
        const modelsArray = Object.keys(modelsObject).map(key => ({ make, model: modelsObject[key] }))
            .concat(Object.keys(modelsObjectUser).map(key => ({ make, model: modelsObjectUser[key] })));


        if (modelsArray.length > 50) {
            res.status(200).json(modelsArray.slice(0, 50));
            return;
        }

        res.status(200).json(modelsArray);
        return;

    } catch (err) {
        next(err);
    }
});


router.get('/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;

        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

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
        const modelsArray = Object.keys(modelsObject).map(key => ({ make, model: modelsObject[key] }))
            .concat(Object.keys(modelsObjectUser).map(key => ({ make, model: modelsObjectUser[key] })));

        const filteredModels = modelsArray.filter(model => model.model.toLowerCase().includes(query.toLowerCase()));

        if (filteredModels.length > 50) {
            res.status(269).json(filteredModels.slice(0, 50));
            return;
        }

        res.status(269).json(filteredModels);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/:make/percentage', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsObjectUser = await redisClient.hGetAll(`makes:${decodedUser.username}:${make}`);
        const modelsArray = Object.keys(modelsObject).map(key => ({ make, model: modelsObject[key] }))
            .concat(Object.keys(modelsObjectUser).map(key => ({ make, model: modelsObjectUser[key] })));

        const spotsKeys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const percentage = Math.floor(spotsKeys.length / modelsArray.length * 100);


        res.status(200).json({ percentage: percentage, numSpots: spotsKeys.length, numModels: modelsArray.length });
    } catch (err) {
        next(err);
    }
});

router.get('/spots/:make/percentage_new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const username = req.query.username;
        
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        console.log(decodedUser, username);

        const modelsObject = await redisClient.hGetAll(`make:${make}`);
        const modelsObjectUser = await redisClient.hGetAll(`makes:${username || decodedUser.username}:${make}`);

        const modelsSet = new Set([
            ...Object.values(modelsObject),
            ...Object.values(modelsObjectUser)
        ]);

        console.log(modelsSet);

        const modelsArray = Array.from(modelsSet).map(model => ({ make, model }));

        const spotsKeys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        console.log(spotsKeys);

        const uniqueModels = new Set(spotsKeys.map(key => key.split(':')[3]));

        console.log(uniqueModels);

        const percentage = modelsArray.length > 0 ? Math.floor((uniqueModels.size / modelsArray.length) * 100) : 0;

        console.log(percentage, spotsKeys.length, modelsArray.length);

        res.status(200).json({ percentage: percentage, numSpots: uniqueModels.size, numModels: modelsArray.length });
    } catch (err) {
        next(err);
    }
});

router.post('/addmake', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const alreadyExists = await redisClient.hGet('makes', make);
        const alreadyExistsUser = await redisClient.hGet(`makes:${decodedUser.username}`, make);

        if (alreadyExists || alreadyExistsUser) {
            res.status(400).json({ message: 'Make already exists' });
            return;
        }

        await redisClient.hSet(`makes:${decodedUser.username}`, make, make);

        res.status(201).json({ message: 'Make created' });
        return;

    } catch (err) {
        next(err);
    }
});

router.post('/addmodel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const alreadyExists = await redisClient.hGet(`makes:${decodedUser.username}:${make}`, model);

        if (alreadyExists) {
            res.status(400).json({ message: 'Model already exists' });
            return;
        }

        await redisClient.hSet(`makes:${decodedUser.username}:${make}`, model, model);

        res.status(201).json({ message: 'Model created' });
        return;

    } catch (err) {
        next(err);
    }
});

router.post('/addtag', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tag } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const alreadyExists = await redisClient.hGet('tags', tag) || await redisClient.hGet(`tags:${decodedUser.username}`, tag);

        if (alreadyExists) {
            res.status(400).json({ message: 'Tag already exists' });
            return;
        }

        await redisClient.hSet(`tags:${decodedUser.username}`, tag, tag);

        res.status(201).json({ message: 'Tag created' });
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/tags', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const tagsObject = await redisClient.hGetAll('tags');
        const tagsObjectUser = await redisClient.hGetAll(`tags:${decodedUser.username}`);
        const tagsArray = Object.keys(tagsObject).map(key => tagsObject[key])
            .concat(Object.keys(tagsObjectUser).map(key => tagsObjectUser[key]));

        res.status(200).json(tagsArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/regnr/:regnr', async (req: Request, res: Response, next: NextFunction) => {
    const { regnr } = req.params;

    const url = `https://akfell-datautlevering.atlas.vegvesen.no/enkeltoppslag/kjoretoydata?kjennemerke=${regnr}`;
    const options = {
        method: 'GET',
        headers: {
            'SVV-Authorization': `Apikey ${process.env.SVV_API_KEY}`,
        },
    };

    try {
        const response = await fetch(url, options);

        let dataCar = {
            make: undefined,
            model: undefined,
            error: undefined,
        };

        if (response.status === 401) {
            dataCar.error = 'Unauthorized: Invalid API key or missing authorization.';
        } else if (response.status === 403) {
            dataCar.error = 'Forbidden: API key not valid or user is blocked.';
        } else if (response.status === 429) {
            dataCar.error = 'Quota exceeded: Too many requests.';
        } else if (response.status === 200) {
            const data = await response.json();

            dataCar.make = data.kjoretoydataListe[0].godkjenning.tekniskGodkjenning.tekniskeData.generelt.merke[0].merke;
            dataCar.model = data.kjoretoydataListe[0].godkjenning.tekniskGodkjenning.tekniskeData.generelt.handelsbetegnelse[0];
        }

        res.status(200).json(dataCar);
    } catch (error) {
        next(error);
    }
});

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/addspot', upload.array('images', 10), async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.time('ExecutionTime');

        const { make, model, notes, date, tags } = req.body;

        const tagsArray = Array.isArray(tags)
            ? tags
            : tags
                ? [tags]
                : [];
        const images = req.files as Express.Multer.File[];
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        if (!make || !model || images.length === 0) {
            res.status(400).json({ message: 'Make, model, and at least one image are required' });
            return;
        }

        const allSpots = await redisClient.keys(`spots:${decodedUser.username}:${make}:${model}:*`);

        let offset = 0;

        allSpots.forEach(key => {
            const spotNum = parseInt(key.split(":")[4], 10);

            if (spotNum > offset) {
                offset = spotNum;
            }
        });

        offset++;


        const imagesBase64 = images.map(image => image.buffer.toString('base64'));

        const data: Record<string, string> = {
            [`notes`]: notes,
            [`date`]: date,
            [`uploadDate`]: new Date().toISOString(),
            [`likes`]: '0'
        };

        imagesBase64.forEach((item, index) => {
            data[`image${index}`] = item;
        });

        if (tagsArray && tagsArray.length > 0) {
            tagsArray.forEach((tag, index) => {
                redisClient.hSet(`tags:${decodedUser.username}:${tag}`, `spots:${decodedUser.username}:${make}:${model}:${offset}`, index);
                data[`tag${index}`] = tag;
            });
        }

        if (!notes) delete data[`notes`];
        if (!date) delete data[`date`];

        await redisClient.zAdd('zset:spots:recent', { score: new Date(data['uploadDate']).getTime(), value: `spots:${decodedUser.username}:${make}:${model}:${offset}` });
        await redisClient.zAdd('zset:spots:likes', { score: parseInt(data['likes']), value: `spots:${decodedUser.username}:${make}:${model}:${offset}` })
        await redisClient.hSet(`spots:${decodedUser.username}:${make}:${model}:${offset}`, data);

        res.status(201).json({ message: 'Spot added' });

        console.timeEnd('ExecutionTime');
    } catch (err) {
        next(err);
    }
});

router.post('/editspot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key, notes, date, tags } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const tagsArray: string[] = Array.isArray(tags)
            ? tags
            : tags
                ? [tags]
                : [];

        if (!make || !model || (key === undefined || key === null)) {
            res.status(400).json({ message: 'Make, model, and key are required' });
            return;
        }

        const spotKeyPrefix = `spots:${decodedUser.username}:${make}:${model}:${key}`;
        const allSpots = await redisClient.hGetAll(spotKeyPrefix);

        if (!allSpots) {
            res.status(404).json({ message: 'Spot not found' });
            return;
        }

        const data: Record<string, string> = {};

        if (tagsArray && tagsArray.length > 0) {
            const allTagsData = await redisClient.hGetAll(`tags:${decodedUser.username}`);
            const allTags: string[] = Array.isArray(allTagsData) ? allTagsData : []

            allTags.forEach(tag => {
            });

            tagsArray.forEach((tag, index) => {
                data[`tag${index}`] = tag;
            });
        }

        if (notes) {
            data[`notes`] = notes;
        } else {
            data[`notes`] = '';
        }

        if (date) {
            data[`date`] = date;
        } else {
            data[`date`] = '';
        }

        const validData = {};
        for (const key in data) {
            if (key && typeof key === 'string' && (typeof data[key] === 'string' || typeof data[key] === 'number' || Buffer.isBuffer(data[key]))) {
                validData[key] = data[key];
            }
        }

        await redisClient.hSet(spotKeyPrefix, validData);

        res.status(200).json({ message: 'Spot edited' });
    } catch (err) {
        next(err);
    }
});

router.post('/deletespot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        if (!make || !model || (key === undefined || key === null)) {
            res.status(400).json({ message: 'Make, model, and key are required' });
            return;
        }

        await redisClient.zRem('zset:spots:recent', `spots:${decodedUser.username}:${make}:${model}:${key}`);
        await redisClient.zRem('zset:spots:likes', `spots:${decodedUser.username}:${make}:${model}:${key}`);

        await redisClient.del(`spots:${decodedUser.username}:${make}:${model}:${key}`);

        const tagsObject = await redisClient.hGetAll(`tags:${decodedUser.username}`);

        for (const tag in tagsObject) {
            await redisClient.hDel(`tags:${decodedUser.username}:${tag}`, `spots:${decodedUser.username}:${make}:${model}:${key}`);
        }

        res.status(200).json({ message: 'Spot deleted' });
    } catch (err) {
        next(err);
    }
});

import sharp from 'sharp';
import { parse } from 'cookie';

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
        const username = req.query.username;
        const { make, model } = req.params;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        if (!make || !model) {
            res.status(400).json({ message: 'Make and model are required' });
            return;
        }

        const allSpotsKeys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:${model}:*`);

        const allSpots = [];

        for (const key of allSpotsKeys) {
            const spot = await redisClient.hGetAll(key);

            const images = Object.keys(spot).filter(key => key.startsWith('image')).map(key => spot[key]);

            const compressedImages = await Promise.all(images.map(async image => await compressImage(image)));

            const tags = Object.keys(spot).filter(key => key.startsWith('tag')).map(key => spot[key]);

            allSpots.push({
                key: key.split(':')[4],
                notes: spot['notes'],
                date: spot['date'],
                spotDate: spot['uploadDate'],
                images: compressedImages,
                tags
            });
        }

        res.status(200).json(allSpots);
    } catch (err) {
        next(err);
    }
});

router.get('/get_spots_new/:make/:model', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const { make, model } = req.params;

        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        if (!make || !model) {
            res.status(400).json({ message: 'Make and model are required' });
            return;
        }

        const allSpotsKeys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:${model}:*`);

        const allSpots = [];

        for (const key of allSpotsKeys) {
            const spot = await redisClient.hGetAll(key);

            const images = Object.keys(spot).filter(key => key.startsWith('image')).map(key => spot[key]);

            const tags = Object.keys(spot).filter(key => key.startsWith('tag')).map(key => spot[key]);

            allSpots.push({
                key: key.split(':')[4],
                images,
                notes: spot['notes'],
                date: spot['date'],
                uploadDate: spot['uploadDate'],
                tags
            });
        }

        res.status(200).json(allSpots);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]).filter((item, index, self) => self.indexOf(item) === index);

        res.status(200).json(makesArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]).filter((item, index, self) => self.indexOf(item) === index);

        const filteredMakes = Array.from(makesArray).filter(make => make.toLowerCase().includes((query as string).toLowerCase()));

        res.status(200).json(filteredMakes);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys.map(key => key.split(':')[3]).filter((item, index, self) => self.indexOf(item) === index);

        const combinedArray = modelsArray.map((model, index) => ({ make: makesArray[index], model }));

        res.status(200).json(combinedArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys.map(key => key.split(':')[3]).filter((item, index, self) => self.indexOf(item) === index);

        const filteredModels = modelsArray.filter(model => model.toLowerCase().includes((query as string).toLowerCase()));

        const combinedArray = filteredModels.map((model, index) => ({ make: makesArray[index], model }));

        res.status(200).json(combinedArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;

        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const modelsArray = keys.map(key => key.split(':')[3]).filter((item, index, self) => self.indexOf(item) === index);

        const combinedArray = modelsArray.map(model => ({ make, model }));

        res.status(200).json(combinedArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;

        const username = req.query.username;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const keys = await redisClient.keys(`spots:${username || decodedUser.username}:${make}:*`);

        const modelsArray = keys.map(key => key.split(':')[3]).filter((item, index, self) => self.indexOf(item) === index);

        const filteredModels = modelsArray.filter(model => model.toLowerCase().includes((query as string).toLowerCase()));

        const combinedArray = filteredModels.map(model => ({ make, model }));

        res.status(200).json(combinedArray);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/discover', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const page = parseInt(req.query.page as string) || 0;
        const sort = req.query.sort as 'recent' | 'hot' | 'top' || 'recent';
        const spotsPerPage = 10;
        const startIndex = page * spotsPerPage;
        const endIndex = (page + 1) * spotsPerPage - 1;

        console.time('ExecutionTime');

        let sortedSpotIDs: string[] = [];

        if (sort === 'recent') {
            sortedSpotIDs = await redisClient.zRange('zset:spots:recent', startIndex, endIndex, { 'REV': true });
        } else if (sort === 'hot' || sort === 'top') {
            sortedSpotIDs = await redisClient.zRange('zset:spots:likes', startIndex, endIndex, { 'REV': true });
        }

        const spots = await Promise.all(
            sortedSpotIDs.map(async spotID => {
                const spot = await redisClient.hGetAll(`${spotID}`);
                const likedByUser = await redisClient.hGet(`likes:${decodedUser.username}`, spotID);

                const compressedImages = await Promise.all(
                    Object.keys(spot).filter(key => key.startsWith('image')).map(async imageKey => await compressImage(spot[imageKey]))
                );

                return {
                    key: spotID.split(':')[4],
                    notes: spot['notes'],
                    date: spot['date'],
                    images: compressedImages,
                    tags: spot['tags'],
                    user: spotID.split(':')[1],
                    make: spotID.split(':')[2],
                    model: spotID.split(':')[3],
                    likes: Number(spot['likes'] || 0),
                    uploadDate: spot['uploadDate'] || new Date().toISOString(),
                    likedByUser: !!likedByUser,
                };
            })
        );

        console.timeEnd('ExecutionTime');

        res.status(200).json(spots);
    } catch (err) {
        next(err);
    }
});


router.post('/likespot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key, user } = req.body;
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        const spotKey = `spots:${user}:${make}:${model}:${key}`;

        const alreadyLiked = await redisClient.hGet(`likes:${decodedUser.username}`, spotKey);

        const spot = await redisClient.hGetAll(spotKey);

        if (!spot) {
            res.status(404).json({ message: 'Spot not found' });
            return;
        }

        const likes = parseInt(spot['likes']) || 0;

        if (alreadyLiked) {
            await redisClient.hDel(`likes:${decodedUser.username}`, spotKey);
            await redisClient.hSet(spotKey, 'likes', likes - 1);

            await redisClient.zAdd('zset:spots:likes', { score: likes - 1, value: spotKey });

            res.status(200).json({ message: 'Spot unliked' });
            return;
        } else {
            await redisClient.hSet(`likes:${decodedUser.username}`, spotKey, spotKey);
            await redisClient.hSet(spotKey, 'likes', likes + 1);

            await redisClient.zAdd('zset:spots:likes', { score: likes + 1, value: spotKey });

            res.status(200).json({ message: 'Spot liked' });
        }
    } catch (err) {
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

    } catch (err) {
        next(err);
    }
});

router.post('/updatespots', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;
        const decodedUser = await get_user(token);

        console.log(decodedUser);

        const is_admin = await redisClient.hGet('admins', decodedUser) ? true : decodedUser === 'Vetle';

        if (!is_admin) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const users = await redisClient.hGetAll('users');

        for (const user of Object.keys(users)) {
            // Update to new format from here

            const keys = await redisClient.keys(`spots:${user}:*`);

            for (const key of keys) {
                const spot = await redisClient.hGetAll(key);

                // from here you have all the spots for all users
                // update one at a time

                let newSpot = spot;
                
                newSpot['likes'] = newSpot['likes'] || '0';
                newSpot['uploadDate'] = newSpot['uploadDate'] || new Date().toISOString();

                console.log(spot['uploadDate']);
                console.log(new Date(spot['uploadDate']).getTime());
                console.log(key);
                console.log(spot['likes']);
                console.log(parseInt(spot['likes']));

                await redisClient.zAdd('zset:spots:recent', { score: new Date(newSpot['uploadDate']).getTime(), value: key });
                await redisClient.zAdd('zset:spots:likes', { score: parseInt(newSpot['likes']), value: key });

                await redisClient.del(key);

                await redisClient.hSet(key, newSpot);
            }
        }

        res.status(200).json({ message: 'Spots updated' });
    } catch (err) {
        next(err);
    }
});

export default router;
