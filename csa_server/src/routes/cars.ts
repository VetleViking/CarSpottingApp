import { NextFunction, Request, Response, Router } from 'express';
import { getCombinedMakes, getCombinedModels, getCombinedTags, getFullSpot, getHotScore } from '../utils/cars';
import { getAllUsers, userFromCookies } from '../utils/user';
import { redisClient } from '../redis-source';
import dotenv from "dotenv";
import multer from 'multer';
import { v4 } from 'uuid';
import path from 'path';
import fs from 'fs';

dotenv.config();

const router = Router();

router.get('/makes', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userFromCookies(req.headers.cookie);

        const makes = await getCombinedMakes(user);

        res.status(200).json(makes);
        return;

    } catch (err) {
        next(err);
    }
});

router.get('/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        const user = await userFromCookies(req.headers.cookie);

        const makes = await getCombinedMakes(user);

        const filteredMakes = makes
        .filter(make => make
            .toLowerCase()
            .includes(query.toLowerCase())
        );

        res.status(200).json(filteredMakes);
    } catch (err) {
        next(err);
    }
});

router.get('/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userFromCookies(req.headers.cookie);

        // if not searched bofore, save search and get from nhtsa instead
        const searchedBefore = await redisClient.hGet(`searchedmakes`, 'unknown');

        if (!searchedBefore) {
            await redisClient.hSet(`searchedmakes`, 'unknown', 'unknown');

            const makes1 = await redisClient.hGetAll(`makes:${user}`);
            const makes2 = await redisClient.hGetAll('makes');

            const makes = Object.values(makes1).concat(Object.values(makes2));

            let modelsArray: { make: string, model: string }[] = [];

            for (const make of makes) {
                const responsePassenger = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Passenger%20Car?format=json`
                );
                const dataPassenger = await responsePassenger.json();

                const responseMPV = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Multipurpose%20Passenger%20Vehicle%20(MPV)?format=json`
                );
                const dataMPV = await responseMPV.json();

                const data = dataPassenger.Results.concat(dataMPV.Results);

                const uniqueModels = data.filter((item: any, index: number, self: any[]) =>
                    index === self.findIndex((t: any) => t.Model_Name === item.Model_Name)
                );

                for (const model of uniqueModels) {
                    redisClient.hSet(`make:${make}`, model.Model_Name, model.Model_Name);
                    modelsArray.push({ make, model: model.Model_Name });
                }
            }

            res.status(200).json(modelsArray.slice(0, 50));
            return;
        }

        // Else, get all models from Redis
        const makes = await getCombinedMakes(user);

        let modelsArray: { make: string, model: string }[] = [];

        for (const make of makes) {
            const models = await getCombinedModels(user, make);
            const modelsWithMake = models.map(model => ({ make, model }));

            modelsArray = modelsArray.concat(modelsWithMake);

            if (modelsArray.length > 50) {
                break;
            }
        }

        res.status(200).json(modelsArray.slice(0, 50));
    } catch (err) {
        next(err);
    }
});

router.get('/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;
        const user = await userFromCookies(req.headers.cookie);

        // if not searched bofore, save search and get from nhtsa instead
        const searchedBefore = await redisClient.hGet(`searchedmakes`, 'unknown');

        if (!searchedBefore) {
            await redisClient.hSet(`searchedmakes`, 'unknown', 'unknown');

            const makes1 = await redisClient.hGetAll(`makes:${user}`);
            const makes2 = await redisClient.hGetAll('makes');

            const makes = Object.values(makes1).concat(Object.values(makes2));

            let modelsArray: { make: string, model: string }[] = [];

            for (const make of makes) {
                const responsePassenger = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Passenger%20Car?format=json`
                );
                const dataPassenger = await responsePassenger.json();

                const responseMPV = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Multipurpose%20Passenger%20Vehicle%20(MPV)?format=json`
                );
                const dataMPV = await responseMPV.json();

                const data = dataPassenger.Results.concat(dataMPV.Results);

                const uniqueModels = data.filter((item: any, index: number, self: any[]) =>
                    index === self.findIndex((t: any) => t.Model_Name === item.Model_Name)
                );

                for (const model of uniqueModels) {
                    redisClient.hSet(`make:${make}`, model.Model_Name, model.Model_Name);
                    modelsArray.push({ make, model: model.Model_Name });
                }
            }

            const filteredModels = modelsArray
                .filter(model => model.model
                    .toLowerCase()
                    .includes(query.toLowerCase())
                );

            res.status(200).json(filteredModels.slice(0, 50));
            return;
        }

        // Else, get all makes from Redis
        const makes = await getCombinedMakes(user);
        makes.push('other');

        let modelsArray: { make: string, model: string }[] = [];

        for (const make of makes) {
            const models = await getCombinedModels(user, make);

            const filteredModels = models
                .filter(model => model
                    .toLowerCase()
                    .includes(query.toLowerCase())
                );

            const modelsWithMake = filteredModels.map(model => ({ make, model }));

            modelsArray = modelsArray.concat(modelsWithMake);

            if (modelsArray.length > 50) {
                break;
            }
        }

        res.status(200).json(modelsArray.slice(0, 50));
    } catch (err) {
        next(err);
    }
});

router.get('/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const user = await userFromCookies(req.headers.cookie);

        // if not searched bofore, save search and get from nhtsa instead
        const searchedBefore = await redisClient.hGet(`searchedmakes`, make);

        if (!searchedBefore) {
            await redisClient.hSet(`searchedmakes`, make, make);

            const responsePassenger = await fetch(
                `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Passenger%20Car?format=json`
            );
            const dataPassenger = await responsePassenger.json();

            const responseMPV = await fetch(
                `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Multipurpose%20Passenger%20Vehicle%20(MPV)?format=json`
            );
            const dataMPV = await responseMPV.json();

            const data = dataPassenger.Results.concat(dataMPV.Results);

            const uniqueModels = data
                .filter((item: any, index: any, self: any) => index === self
                    .findIndex((t: any) => (t.Model_Name === item.Model_Name)));

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${make}`, model.Model_Name, model.Model_Name);
            });

            const modelsArray = uniqueModels.map(model => ({ make, model: model.Model_Name }));

            res.status(200).json(modelsArray.slice(0, 50));
            return;
        }

        // Else, get all models from Redis
        const models = await getCombinedModels(user, make)
        const modelsArray = models.map(model => ({ make, model }));

        res.status(200).json(modelsArray.slice(0, 50));
    } catch (err) {
        next(err);
    }
});

router.get('/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;
        const user = await userFromCookies(req.headers.cookie);

        // if not searched bofore, save search and get from nhtsa instead
        const searchedBefore = await redisClient.hGet(`searchedmakes`, make);

        if (!searchedBefore) {
            await redisClient.hSet(`searchedmakes`, make, make);

            const responsePassenger = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Passenger%20Car?format=json`);
            const dataPassenger = await responsePassenger.json();

            const responseMPV = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/vehicleType/Multipurpose%20Passenger%20Vehicle%20(MPV)?format=json`);
            const dataMPV = await responseMPV.json();

            const data = dataPassenger.Results.concat(dataMPV.Results);

            const uniqueModels = data.filter((item: any, index: any, self: any) =>
                index === self.findIndex((t: any) => (
                    t.Model_Name === item.Model_Name
                ))
            );

            uniqueModels.forEach(async model => {
                redisClient.hSet(`make:${make}`, model.Model_Name, model.Model_Name);
            });

            const modelsArray = uniqueModels.map(model => ({ make, model: model.Model_Name }));

            const filteredModels = modelsArray
                .filter(model => model.model
                    .toLowerCase()
                    .includes(query.toLowerCase())
                );

            if (filteredModels.length > 50) {
                res.status(200).json(filteredModels.slice(0, 50));
                return;
            }

            res.status(200).json(filteredModels);
            return;
        }

        // Else, get all models from Redis
        const models = await getCombinedModels(user, make)
        const modelsArray = models.map(model => ({ make, model }));

        const filteredModels = modelsArray
            .filter(model => model.model
                .toLowerCase()
                .includes(query.toLowerCase())
            );

        res.status(269).json(filteredModels.slice(0, 50));
    } catch (err) {
        next(err);
    }
});

router.get('/spots/:make/percentage', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;
        const username = req.query.username;

        const user = await userFromCookies(req.headers.cookie);

        const modelsArray = await getCombinedModels(user, make);
        const spotsKeys = await redisClient.keys(`spots:${username || user}:${make}:*`);
        const uniqueModels = new Set(spotsKeys.map(key => key.split(':')[3]));

        const percentage = modelsArray.length > 0 ? Math.floor((uniqueModels.size / modelsArray.length) * 100) : 0;

        res.status(200).json({ 
            percentage: percentage, 
            numSpots: uniqueModels.size, 
            numModels: modelsArray.length 
        });
    } catch (err) {
        next(err);
    }
});

router.post('/addmake', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        const alreadyExists = await redisClient.hGet('makes', make);
        const alreadyExistsUser = await redisClient.hGet(`makes:${user}`, make);

        if (alreadyExists || alreadyExistsUser) {
            res.status(400).json({ message: 'Make already exists' });
            return;
        }

        await redisClient.hSet(`makes:${user}`, make, make);

        res.status(201).json({ message: 'Make created' });
    } catch (err) {
        next(err);
    }
});

router.post('/addmodel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        const alreadyExists = await redisClient.hGet(`makes:${user}:${make}`, model);

        if (alreadyExists) {
            res.status(400).json({ message: 'Model already exists' });
            return;
        }

        await redisClient.hSet(`makes:${user}:${make}`, model, model);

        res.status(201).json({ message: 'Model created' });
    } catch (err) {
        next(err);
    }
});

router.post('/addtag', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tag } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        const alreadyExists = await redisClient.hGet('tags', tag) 
            || await redisClient.hGet(`tags:${user}`, tag);

        if (alreadyExists) {
            res.status(400).json({ message: 'Tag already exists' });
            return;
        }

        await redisClient.hSet(`tags:${user}`, tag, tag);

        res.status(201).json({ message: 'Tag created' });
    } catch (err) {
        next(err);
    }
});

router.get('/tags', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userFromCookies(req.headers.cookie);

        const tagsObject = await redisClient.hGetAll('tags');
        const tagsObjectUser = await redisClient.hGetAll(`tags:${user}`);
        const tagsArray = Object.keys(tagsObject)
            .map(key => tagsObject[key])
            .concat(Object.keys(tagsObjectUser).map(key => tagsObjectUser[key]));

        res.status(200).json(tagsArray);
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

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

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
        const user = await userFromCookies(req.headers.cookie);

        if (!make || !model || images.length === 0) {
            return res.status(400).json({ message: 'Make, model, and at least one image are required' });
        }

        const allSpots = await redisClient.keys(`spots:${user}:${make}:${model}:*`);

        let offset = 0;

        allSpots.forEach(key => {
            const spotNum = parseInt(key.split(":")[4], 10);

            if (spotNum >= offset) {
                offset = spotNum + 1;
            }
        });

        const data: Record<string, string> = {
            [`notes`]: notes,
            [`date`]: date,
            [`uploadDate`]: new Date().toISOString(),
            [`likes`]: '0'
        };

        if (process.env.PRODUCTION !== 'true') { // if not prod, dont try to save images
            const imagePaths: string[] = [];
            for (const [index] of images.entries()) {
                const imageName = `${offset}_${index}.jpg`;  // Unique image name
                imagePaths.push(`/${user}/${make}_${model}/${imageName}`);
            }

            imagePaths.forEach((item, index) => {
                data[`image${index}`] = item;
            });
        } else {
            const rootDir = path.resolve(__dirname, '../../');
            const userDir = path.join(rootDir, 'uploads', user, `${make}_${model}`);
            await fs.promises.mkdir(userDir, { recursive: true });

            const imagePaths: string[] = [];
            for (const [index, image] of images.entries()) {
                const imageName = `${offset}_${index}.jpg`;  // Unique image name
                const imagePath = path.join(userDir, imageName);
                await fs.promises.writeFile(imagePath, image.buffer);  // Write image buffer to file
                imagePaths.push(`/${user}/${make}_${model}/${imageName}`);
            }

            imagePaths.forEach((item, index) => {
                data[`image${index}`] = item;
            });
        }

        if (tagsArray && tagsArray.length > 0) {
            tagsArray.forEach((tag, index) => {
                redisClient.hSet(`tags:${user}:${tag}`, `spots:${user}:${make}:${model}:${offset}`, index);
                data[`tag${index}`] = tag;
            });
        }

        if (!notes) delete data[`notes`];
        if (!date) delete data[`date`];

        const spotsUser = +(await redisClient.hGet(`users:${user}`, 'total_spots')) || 0;

        await redisClient.hSet(`users:${user}`, 'total_spots', spotsUser + 1);
        await redisClient.zAdd('zset:spots:recent', { 
            score: new Date(data['uploadDate']).getTime(), 
            value: `spots:${user}:${make}:${model}:${offset}` 
        });
        await redisClient.zAdd('zset:spots:likes', { 
            score: parseInt(data['likes']), 
            value: `spots:${user}:${make}:${model}:${offset}` 
        });
        await redisClient.hSet(`spots:${user}:${make}:${model}:${offset}`, data);

        res.status(201).json({ message: 'Spot added' });

        console.timeEnd('ExecutionTime');
    } catch (err) {
        next(err);
    }
});

router.post('/addcomment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, comment, parentId } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        if (!key || !comment) {
            res.status(400).json({ message: 'Key and comment are required' });
            return;
        }

        const data: Record<string, string> = {
            [`key`]: key,
            [`comment`]: comment,
            [`user`]: user,
            [`date`]: new Date().toISOString(),
            [`likes`]: '0'
        };

        if (parentId) {
            data[`parentId`] = parentId;
        }

        const commentId = v4();

        const commentKeyPrefix = `comments:${key}:${commentId}`;

        data[`commentId`] = commentId;

        const validData = {};
        for (const key in data) {
            if (key 
                && typeof key === 'string' 
                && (typeof data[key] === 'string' 
                    || typeof data[key] === 'number' 
                    || Buffer.isBuffer(data[key]))) {
                validData[key] = data[key];
            }
        }

        await redisClient.hSet(commentKeyPrefix, validData);

        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        next(err);
    }
});

router.post('/likecomment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, commentId } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        if (!key || !commentId) {
            res.status(400).json({ message: 'Key and commentId are required' });
            return;
        }

        const alreadyLiked = await redisClient.hGet(`likes:comments:${user}`, `${key}:${commentId}`);

        const commentKey = `comments:${key}:${commentId}`;

        const comment = await redisClient.hGetAll(commentKey);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (alreadyLiked) {
            await redisClient.hDel(`likes:comments:${user}`, `${key}:${commentId}`);

            const likes = (parseInt(comment['likes']) || 0) - 1;

            await redisClient.hSet(commentKey, { [`likes`]: likes.toString() });

            res.status(200).json({ message: 'Comment unliked' });
        } else {
            await redisClient.hSet(`likes:comments:${user}`, `${key}:${commentId}`, 'true');

            const likes = (parseInt(comment['likes']) || 0) + 1;

            await redisClient.hSet(commentKey, { [`likes`]: likes.toString() });

            res.status(200).json({ message: 'Comment liked' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/deletecomment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key, commentId } = req.body;
        const user = await userFromCookies(req.headers.cookie);
        const isAdmin = await redisClient.hGet('admins', user);

        if (!key || !commentId) {
            res.status(400).json({ message: 'Key and commentId are required' });
            return;
        }

        const commentKey = `comments:${key}:${commentId}`;

        const comment = await redisClient.hGetAll(commentKey);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (comment['user'] !== user && !isAdmin) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await redisClient.hSet(commentKey, { [`deleted`]: 'true' });
        await redisClient.hSet(commentKey, { [`deletedBy`]: isAdmin ? 'admin' : 'user' });

        res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        next(err);
    }
});

router.get('/getcomments/:key', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { key } = req.params;
        const user = await userFromCookies(req.headers.cookie);

        const allCommentsKeys = await redisClient.keys(`comments:${key}:*`);

        const allComments = [];

        for (const commentKey of allCommentsKeys) {
            const comment = await redisClient.hGetAll(commentKey);

            const alreadyLiked = await redisClient.hGet(`likes:comments:${user}`, `${key}:${comment['commentId']}`);
            comment['liked'] = alreadyLiked ? 'true' : 'false';

            if (comment['deleted'] === 'true') { // comment content isnt deleted if deleted, just not sent to frontend
                comment['comment'] = '[deleted by ' + comment['deletedBy'] + ']';
            }

            allComments.push(comment);
        }

        res.status(200).json(allComments);
    } catch (err) {
        next(err);
    }
});

router.post('/editspot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key, notes, date, tags } = req.body;
        const user = await userFromCookies(req.headers.cookie);

        const tagsArray: string[] = Array.isArray(tags)
            ? tags
            : tags
                ? [tags]
                : [];

        if (!make || !model || (key === undefined || key === null)) {
            res.status(400).json({ message: 'Make, model, and key are required' });
            return;
        }

        const spotKeyPrefix = `spots:${user}:${make}:${model}:${key}`;
        const spot = await redisClient.hGetAll(spotKeyPrefix);

        if (!spot) {
            res.status(404).json({ message: 'Spot not found' });
            return;
        }

        const data: Record<string, string> = {};

        tagsArray.forEach((tag, index) => {
            data[`tag${index}`] = tag;
        });

        data[`notes`] = notes || '';

        data[`date`] = date || '';

        const validData = {};
        for (const key in data) {
            if (key 
                && typeof key === 'string' 
                && (typeof data[key] === 'string' 
                    || typeof data[key] === 'number' 
                    || Buffer.isBuffer(data[key]))) {
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
        const user = await userFromCookies(req.headers.cookie);
        const isAdmin = await redisClient.hGet('admins', user);

        if (!make || !model || (key === undefined || key === null)) {
            res.status(400).json({ message: 'Make, model, and key are required' });
            return;
        }

        const spotKeyPrefix = `spots:${user}:${make}:${model}:${key}`;
        const spot = await redisClient.hGetAll(spotKeyPrefix);

        if (!isAdmin && spot['user'] !== user) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const spotsUser = +(await redisClient.hGet(`users:${user}`, 'total_spots')) || 0;
        await redisClient.hSet(`users:${user}`, 'total_spots', spotsUser - 1);

        await redisClient.zRem('zset:spots:recent', spotKeyPrefix);
        await redisClient.zRem('zset:spots:likes', spotKeyPrefix);

        await redisClient.del(spotKeyPrefix);

        const tagsObject = await redisClient.hGetAll(`tags:${user}`);

        for (const tag in tagsObject) {
            await redisClient.hDel(`tags:${user}:${tag}`, spotKeyPrefix);
        }

        res.status(200).json({ message: 'Spot deleted' });
    } catch (err) {
        next(err);
    }
});

router.get('/get_spots/:make/:model', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, key } = req.query;
        const { make, model } = req.params;

        const user = await userFromCookies(req.headers.cookie);

        if (!make || !model) {
            res.status(400).json({ message: 'Make and model are required' });
            return;
        }

        const allSpotsKeys = await redisClient.keys(`spots:${username || user}:${make}:${model}:*`);

        const allSpots = [];

        for (const key of allSpotsKeys) {
            allSpots.push(await getFullSpot(key));
        }

        if (key) {
            const spot = allSpots.find(spot => spot.key === key);

            if (!spot) {
                res.status(404).json({ message: `Spot with key ${key} not found` });
                return;
            }

            res.status(200).json([spot]);
            return;
        }

        res.status(200).json(allSpots);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:*`);

        const makesArray = keys
            .map(key => key.split(':')[2])
            .filter((item, index, self) => self.indexOf(item) === index);

        res.status(200).json(makesArray);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:*`);

        const makesArray = keys
            .map(key => key.split(':')[2])
            .filter((item, index, self) => self.indexOf(item) === index);

        const filteredMakes = Array.from(makesArray)
            .filter(make => make
                .toLowerCase()
                .includes((query as string).toLowerCase())
            );

        res.status(200).json(filteredMakes);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys
            .map(key => key.split(':')[3])
            .filter((item, index, self) => self.indexOf(item) === index);

        const combinedArray = modelsArray.map((model, index) => ({ make: makesArray[index], model }));

        res.status(200).json(combinedArray);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/unknown/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.params;

        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:*`);

        const makesArray = keys.map(key => key.split(':')[2]);
        const modelsArray = keys
            .map(key => key.split(':')[3])
            .filter((item, index, self) => self.indexOf(item) === index);

        const filteredModels = modelsArray
            .filter(model => model
                .toLowerCase()
                .includes((query as string).toLowerCase())
            );

        const combinedArray = filteredModels.map((model, index) => ({ make: makesArray[index], model }));

        res.status(200).json(combinedArray);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make } = req.params;

        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:${make}:*`);

        const modelsArray = keys
            .map(key => key.split(':')[3])
            .filter((item, index, self) => self.indexOf(item) === index);

        const combinedArray = modelsArray.map(model => ({ make, model }));

        res.status(200).json(combinedArray);
    } catch (err) {
        next(err);
    }
});

router.get('/spots/makes/:make/models/:query', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, query } = req.params;

        const username = req.query.username;
        const user = await userFromCookies(req.headers.cookie);

        const keys = await redisClient.keys(`spots:${username || user}:${make}:*`);

        const modelsArray = keys
            .map(key => key.split(':')[3])
            .filter((item, index, self) => self.indexOf(item) === index);

        const filteredModels = modelsArray
            .filter(model => model
                .toLowerCase()
                .includes((query as string).toLowerCase())
            );

        const combinedArray = filteredModels.map(model => ({ make, model }));

        res.status(200).json(combinedArray);
    } catch (err) {
        next(err);
    }
});

router.get('/discover', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userFromCookies(req.headers.cookie);

        const page = parseInt(req.query.page as string) || 0;
        const sort = req.query.sort as 'recent' | 'hot' | 'top' || 'recent';
        const search = req.query.search as string;
        const spotsPerPage = 10;
        const startIndex = page * spotsPerPage;
        const endIndex = (page + 1) * spotsPerPage - 1;

        let sortedSpotIDs: string[] = [];

        if (search) { // if search, cant use zset
            const allSpotsKeys = await redisClient.keys(`spots:*`);
            const allSpots = await Promise.all(allSpotsKeys.map(async key => await redisClient.hGetAll(key)));

            const searchSegments = search.split('&');

            const filteredSpotIds = allSpots.map((spot, i) => {
                const searchResult = searchSegments.every(searchString => {
                    const stringSplit = searchString.toLowerCase().split(':');
                    const reversed = stringSplit[0].startsWith('!');
                    const key = !stringSplit[1] ? null 
                        : reversed ? stringSplit[0].slice(1) 
                            : stringSplit[0]; // if no value, use key as value
                    const value = stringSplit[1] ? stringSplit[1] : stringSplit[0]; // if no value, use key as value
                    const spotKey = allSpotsKeys[i].toLowerCase();

                    const tags = Object.keys(spot)
                        .filter(key => key.startsWith('tag'))
                        .map(key => spot[key])
                        .map(tag => tag.toLowerCase());

                    let match = false;

                    if (key === 'user') {
                        match = spotKey.split(':')[1] === value;
                    } else if (key === 'make') {
                        match = spotKey.split(':')[2].includes(value);
                    } else if (key === 'model') {
                        match = spotKey.split(':')[3].includes(value);
                    } else if (key === 'tag') {
                        match = tags.includes(value);
                    } else if (key === 'likes') {
                        match = spot['likes'] === value;
                    } else if (key === 'notes') {
                        match = spot['notes']?.toLowerCase().includes(value);
                    } else if (!key) { // if no key, search in make and model
                        const [, , rawMake, rawModel] = spotKey.split(':');
                        const combined = (rawMake + ' ' + rawModel).toLowerCase();

                        const parts = value.toLowerCase().split(' ');

                        match = parts.every(part => combined.includes(part));
                    }

                    return reversed ? !match : match;
                });

                return searchResult ? allSpotsKeys[i] : null;
            }).filter(Boolean) as string[];

            if (sort === 'recent') {
                const dateMap: { [key: string]: string } = {};
                for (const id of filteredSpotIds) {
                    dateMap[id] = await redisClient.hGet(id, 'uploadDate');
                }
                filteredSpotIds.sort((a, b) => {
                    const dateA = dateMap[a];
                    const dateB = dateMap[b];
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                });
            } else if (sort === 'top') {
                const likesMap: { [key: string]: number } = {};
                for (const id of filteredSpotIds) {
                    likesMap[id] = parseInt(await redisClient.hGet(id, 'likes')) || 0;
                }
                filteredSpotIds.sort((a, b) => {
                    const likesA = likesMap[a];
                    const likesB = likesMap[b];
                    return likesB - likesA;
                });
            } else if (sort === 'hot') {
                let hotScore: Record<string, number> = {};

                await Promise.all(filteredSpotIds.map(async id => {
                    const likes = parseInt(await redisClient.hGet(id, 'likes')) || 0;
                    const date = new Date(await redisClient.hGet(id, 'uploadDate')).getTime();
                    hotScore[id] = getHotScore(likes, date);
                }));

                filteredSpotIds.sort((a, b) => hotScore[b] - hotScore[a]);
            }

            sortedSpotIDs = filteredSpotIds.slice(startIndex, endIndex + 1);
        } else {
            if (sort === 'recent') {
                sortedSpotIDs = await redisClient.zRange('zset:spots:recent', startIndex, endIndex, { 'REV': true });
            } else if (sort === 'top') {
                sortedSpotIDs = await redisClient.zRange('zset:spots:likes', startIndex, endIndex, { 'REV': true });
            } else if (sort === 'hot') {
                const allSpotsKeys = await redisClient.keys(`spots:*`);
                
                let hotScore = {};

                await Promise.all(allSpotsKeys.map(async id => {
                    const likes = parseInt(await redisClient.hGet(id, 'likes')) || 0;
                    const date = new Date(await redisClient.hGet(id, 'uploadDate')).getTime();

                    hotScore[id] = getHotScore(likes, date);
                }))

                allSpotsKeys.sort((a, b) => {
                    const scoreA = hotScore[a];
                    const scoreB = hotScore[b];
                    return scoreB - scoreA;
                });

                sortedSpotIDs = allSpotsKeys.slice(startIndex, endIndex + 1);
            }
        }

        const spots = await Promise.all(
            sortedSpotIDs.map(async spotID => {
                return await getFullSpot(spotID);
            })
        );

        res.status(200).json(spots);
    } catch (err) {
        next(err);
    }
});

async function fetchAndFilter( 
    fetchFn: () => Promise<string[]>, searchValue: string 
): Promise<string[]> {
    const allValues = await fetchFn();
    const filtered = allValues
        .filter(v => v
            .toLowerCase()
            .startsWith(searchValue.toLowerCase())
        );
    return filtered;
}

router.get('/search_autocomplete', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query;

        const user = await userFromCookies(req.headers.cookie);

        if (!query || typeof query !== 'string') {
            res.status(400).json({ message: 'Query is required' });
            return;
        }

        const searchSegments = query.split('&');
        const currentSearch = searchSegments[searchSegments.length - 1];
        const previousSearchParts = searchSegments.slice(0, searchSegments.length - 1);

        const stringSplit = currentSearch.toLowerCase().split(':');
        const key = stringSplit[1] === undefined ? null 
            : stringSplit[0].startsWith('!') ? stringSplit[0].slice(1) 
                : stringSplit[0]; // if no value, use key as value
        const value = stringSplit[1] !== undefined ? stringSplit[1] : stringSplit[0]; // if no value, use key as value

        const searchStringsEnd = [];

        if (key === 'user') {
            const filteredUsers = await fetchAndFilter(getAllUsers, value);
            searchStringsEnd.push(...filteredUsers.map(user => `user:${user}`));
        } else if (key === 'tag') {
            const filteredTags = await fetchAndFilter(() => getCombinedTags(user), value);
            searchStringsEnd.push(...filteredTags.map(tag => `tag:${tag}`));
        } else if (key === 'make') {
            const filteredMakes = await fetchAndFilter(() => getCombinedMakes(user), value);
            searchStringsEnd.push(...filteredMakes.map(make => `make:${make}`));
        } else if (key === 'model') {
            const makesArray = [];
            
            const queryMake = previousSearchParts.find(search => search.startsWith('make:'));
            
            if (queryMake) {
                makesArray.push(queryMake.split(':')[1]);
            } else {
                const makes = await getCombinedMakes(user);
                makesArray.push(...makes);
            }
            
            const modelsArray = [];
            
            for (const make of makesArray) {
                const filteredModels = await fetchAndFilter(() => getCombinedModels(user, make), value);               
                modelsArray.push(...filteredModels);
            }
            
            searchStringsEnd.push(...modelsArray.map(model => `model:${model}`));
        } else if (key === 'likes' || key === 'notes') { // Dont do anything
        } else { // if no key, search in make and model
            const parts = value.split(' ');
            const makes = await getCombinedMakes(user);
            const lowerMakes = makes.map(make => make.toLowerCase());

            let matchedMake = ""; 
            let modelSearch = "";

            for (let i = 0; i < parts.length; i++) {
                const possibleMake = parts.slice(0, i + 1).join(' ');

                if (lowerMakes.includes(possibleMake)) {
                    matchedMake = makes[lowerMakes.indexOf(possibleMake)];
                    modelSearch = parts.slice(i + 1).join(" ");
                    break;
                }
            };

            if (!matchedMake) { // if not found make, search in make
                const filteredMakes = makes.filter(make => make.toLowerCase().startsWith(value));

                if (filteredMakes.length === 0) { // if no makes, search in models
                    for (const make of makes) {
                        const filteredModels = await fetchAndFilter(() => getCombinedModels(user, make), value);
                        searchStringsEnd.push(...filteredModels.map(model => `${make} ${model}`));
                    }
                } else {
                    searchStringsEnd.push(...filteredMakes);
                }
            } else { // if found make, search in make and model
                const filteredModels = await fetchAndFilter(() => getCombinedModels(user, matchedMake), modelSearch);
                searchStringsEnd.push(...filteredModels.map(model => `${matchedMake} ${model}`));
            }
        }

        const searchStrings = searchStringsEnd
            .map(searchString => 
                `${previousSearchParts.join("&")}
                 ${previousSearchParts.length > 0 ? "&" : ""}
                 ${searchString}`
            );
        const sortedSearchStrings = searchStrings.sort((a, b) => a.localeCompare(b));

        res.status(200).json(sortedSearchStrings);
    } catch (err) {
        next(err);
    }
});

router.post('/likespot', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { make, model, key, user } = req.body;
        const decodedUser = await userFromCookies(req.headers.cookie);

        const spotKey = `spots:${user}:${make}:${model}:${key}`;

        const alreadyLiked = await redisClient.hGet(`likes:${decodedUser}`, spotKey);

        const spot = await redisClient.hGetAll(spotKey);

        if (!spot) {
            res.status(404).json({ message: 'Spot not found' });
            return;
        }

        const likes = parseInt(spot['likes']) || 0;
        const userLikes = +(await redisClient.hGet(`users:${user}`, 'total_likes')) || 0;

        const newLikes = alreadyLiked ? likes - 1 : likes + 1;
        const newUserLikes = alreadyLiked ? userLikes - 1 : userLikes + 1;

        await redisClient.hSet(spotKey, 'likes', newLikes);
        await redisClient.hSet(`users:${user}`, 'total_likes', newUserLikes);

        await redisClient.zAdd('zset:spots:likes', { score: newLikes, value: spotKey });

        if (alreadyLiked) {
            await redisClient.hDel(`likes:${decodedUser}`, spotKey);
            res.status(200).json({ message: 'Spot unliked' });
            return;
        } else {
            await redisClient.hSet(`likes:${decodedUser}`, spotKey, spotKey);
            res.status(200).json({ message: 'Spot liked' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/updatespots', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userFromCookies(req.headers.cookie);

        const is_admin = await redisClient.hGet('admins', user) ? true : user === 'Vetle';

        if (!is_admin) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const users = await getAllUsers();

        for (const user of users) {

            const keys = await redisClient.keys(`spots:${user}:*`);

            for (const key of keys) {
                const spot = await redisClient.hGetAll(key);

                // from here you have all the spots for all users
                // update one at a time

                let newSpot = { ...spot };

                console.log('Old Spot:', spot);
                console.log('New Spot:', newSpot);
            }
        }

        res.status(200).json({ message: 'Spots updated' });
    } catch (err) {
        next(err);
    }
});

export default router;
