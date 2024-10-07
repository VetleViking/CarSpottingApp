import { add_make, add_model, get_makes, get_models } from "@/api/cars";

export default async function uploadMissing(make: string, model: string) {
    const makeExists = await get_makes(make);
    if (!makeExists.length || !makeExists.some((make: string) => make.toLowerCase() === make.toLowerCase())) {
        add_make(make);
    }

    const modelExists = await get_models(make, model);
    if (!modelExists.length || !modelExists.some((model: string) => model.toLowerCase() === model.toLowerCase())) {
        add_model(make, model);
    }

    return true;
}