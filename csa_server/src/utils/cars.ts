import { redisClient } from "../redis-source";

export const getGlobalMakes = async () => {
    const makesObject = await redisClient.hGetAll('makes');
    const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

    return makesArray;
}

export const getUserMakes = async (user: string) => {
    const makesObject = await redisClient.hGetAll(`makes:${user}`);
    const makesArray = Object.keys(makesObject).map(key => makesObject[key]);

    return makesArray;
}

export const getCombinedMakes = async (user: string) => {
    const globalMakes = await getGlobalMakes();
    const userMakes = await getUserMakes(user);

    return [...globalMakes, ...userMakes];
}

export const getAllMakes = async () => {
    const allUsers = await redisClient.hGetAll('users');
    const users = Object.keys(allUsers);
    let makesArray = await getGlobalMakes();

    for (const user of users) {
        const userMakes = await getUserMakes(user);
        makesArray.push(...userMakes);
    }

    return makesArray;
}

export const getGlobalModels = async (make: string) => {
    const modelsObject = await redisClient.hGetAll(`make:${make}`);
    const modelsArray = Object.keys(modelsObject).map(key => modelsObject[key]);

    return modelsArray;
}

export const getUserModels = async (user: string, make: string) => {
    const modelsObject = await redisClient.hGetAll(`makes:${user}:${make}`);
    const modelsArray = Object.keys(modelsObject).map(key => modelsObject[key]);

    return modelsArray;
}

export const getCombinedModels = async (user: string, make: string) => {
    const globalModels = await getGlobalModels(make);
    const userModels = await getUserModels(user, make);

    return [...globalModels, ...userModels];
}

export const getAllModels = async (make: string) => {
    const allUsers = await redisClient.hGetAll('users');
    const users = Object.keys(allUsers);
    let modelsArray = await getGlobalModels(make);

    for (const user of users) {
        const userModels = await getUserModels(user, make);
        modelsArray.push(...userModels);
    }

    return modelsArray;
}

export const getGlobalTags = async () => {
    const tagsObject = await redisClient.hGetAll('tags');
    const tagsArray = Object.keys(tagsObject).map(key => tagsObject[key]);

    return tagsArray;
}

export const getUserTags = async (user: string) => {
    const tagsObject = await redisClient.hGetAll(`tags:${user}`);
    const tagsArray = Object.keys(tagsObject).map(key => tagsObject[key]);

    return tagsArray;
}

export const getCombinedTags = async (user: string) => {
    const globalTags = await getGlobalTags();
    const userTags = await getUserTags(user);

    return [...globalTags, ...userTags];
}

export const getAllTags = async () => {
    const allUsers = await redisClient.hGetAll('users');
    const users = Object.keys(allUsers);
    let tagsArray = await getGlobalTags();

    for (const user of users) {
        const userTags = await getUserTags(user);
        tagsArray.push(...userTags);
    }

    return tagsArray;
}