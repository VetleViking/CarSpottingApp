import makes from './makes.json';

export async function get_models(make?: string, model?: string) {
    const params = new URLSearchParams();
    if (make) params.append('make', make);
    if (model) params.append('model', model);
    if (!make && !model) params.append('model', 'a');
    params.append('limit', '50');

    const response = await fetch(`https://api.api-ninjas.com/v1/cars` + '?' + params.toString(), {
        headers: {
        'X-Api-Key': `9UKQbcg6KLGBNFl1N0I2Kw==pvGsAwuxi8RToxzi`
        }
    });

    // return response.json();

    const data = await response.json();

    const uniqueModels = data.filter((item: any, index: any, self: any) =>
        index === self.findIndex((t: any) => (
            t.model === item.model
        ))
    );

    return uniqueModels;
}

export async function get_makes(make?: string) {
    if (!make) return makes;
    return  makes.filter((item) => item.name.toLowerCase().includes(make.toLowerCase()));
}