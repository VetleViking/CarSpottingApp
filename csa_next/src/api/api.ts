import makes from './makes.json';

export async function get_models(make?: string, model?: string) {
    const params = new URLSearchParams();
    if (make) params.append('make', make);
    if (model) params.append('model', model);
    params.append('limit', '50');
    params.append('offset', '300');

    const response = await fetch(`https://api.api-ninjas.com/v1/cars` + '?' + params.toString(), {
        headers: {
        'X-Api-Key': `9UKQbcg6KLGBNFl1N0I2Kw==pvGsAwuxi8RToxzi`
        }
    });

    return await response.json();
}

export async function get_makes(make?: string) {
    if (!make) return makes;
    return  makes.filter((item) => item.name.toLowerCase().includes(make.toLowerCase()));
}