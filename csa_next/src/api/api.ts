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

export async function upload_makes() {
    makes.forEach(async (make) => {
        await fetch(`http://localhost:4000/api/v1/cars/makes/${make.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
    });
}


export async function create_user(username: string, password: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function login(username: string, password: string) {
    const response = await fetch(`http://localhost:4000/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
    } else {
        return await response.json();
    }

    return response;
}