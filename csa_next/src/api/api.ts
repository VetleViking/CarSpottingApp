export async function get_models(make?: string, query?: string) {
    if (!make) make = 'unknown';

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/makes/${make}/models/${query}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function get_makes(query?: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/makes/${query}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function add_make(make: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/addmake`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ make })
    });

    return await response.json();
}

export async function add_model(make: string, model: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/addmodel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ make, model })
    });

    return await response.json();
}

export async function upload_spot(make: string, model: string, images: File[], notes?: string, date?: string) {
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    
    images.forEach(image => {
        formData.append('images', image);
    });

    if (notes) formData.append('notes', notes);
    if (date) formData.append('date', date);

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/addspot`, {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
    });

    return await response.json();
}

export async function delete_spot(make: string, model: string, key: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/deletespot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ make, model, key })
    });

    return await response.json();
}

export async function get_spotted_makes(query?: string, username?: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/spots/makes/${query}${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function get_spotted_models(make?: string, query?: string, username?: string) {
    if (!make) make = 'unknown';
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/spots/makes/${make}/models/${query}${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json()
}

export async function get_spotted_make_percentage(make: string, username?: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/spots/${make}/percentage${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json()
}

export async function get_spotted_images(make: string, model: string, username?: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/getspots/${make}/${model}${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    console.log("test")
    
    const images = data.map((item: any) => {
        const urlArr = [];

        for (let i = 0; i < item.images.length; i++) {
            const url = item.images[i].image ? `data:image/jpeg;base64,${item.images[i].image}` : null;
            urlArr.push(url);
        }

        console.log(urlArr)

        return { key: item.key, urlArr, notes: item.notes, date: item.date };
    });

    return images;
}

export async function create_user(username: string, password: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function login(username: string, password: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function decode_jwt(token: string) {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/decodejwt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}