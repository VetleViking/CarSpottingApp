const apiIpCars = `http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/`


export async function get_models(make?: string, query?: string) {
    if (!make) make = 'unknown';

    const response = await fetch(`${apiIpCars}makes/${make}/models/${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function get_makes(query?: string) {
    const response = await fetch(`${apiIpCars}makes/${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function add_make(make: string) {
    const response = await fetch(`${apiIpCars}addmake`, {
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
    const response = await fetch(`${apiIpCars}addmodel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ make, model })
    });

    return await response.json();
}

export async function add_tag(tag: string) {
    const response = await fetch(`${apiIpCars}addtag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ tag })
    });

    return await response.json();
}

export async function get_tags() {
    const response = await fetch(`${apiIpCars}tags`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function regnr_info(regnr: string) {
    const response = await fetch(`${apiIpCars}regnr/${regnr}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function upload_spot(make: string, model: string, images: File[], notes?: string, date?: string, tags?: string[]) {
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);

    images.forEach(image => {
        formData.append('images', image);
    });

    if (tags) {
        tags.forEach(tag => {
            formData.append('tags', tag);
        });
    }

    if (notes) formData.append('notes', notes);
    if (date) formData.append('date', date);

    const response = await fetch(`${apiIpCars}addspot`, {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
    });

    return await response.json();
}

export async function edit_spot(make: string, model: string, key: string, notes: string, date: string, tags?: string[]) {
    const response = await fetch(`${apiIpCars}editspot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ make, model, key, notes, date, tags })
    });

    return await response.json();
}

export async function delete_spot(make: string, model: string, key: string) {
    const response = await fetch(`${apiIpCars}deletespot`, {
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
    const response = await fetch(`${apiIpCars}spots/makes/${query}${username ? '?username=' + username : ''}`, {
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
    const response = await fetch(`${apiIpCars}spots/makes/${make}/models/${query}${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json()
}

export async function get_spotted_make_percentage(make: string, username?: string) {
    const response = await fetch(`${apiIpCars}spots/${make}/percentage${username ? '?username=' + username : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json()
}

export async function get_spotted_images(make: string, model: string, username?: string) {
    const encodedMake = encodeURIComponent(make);
    const encodedModel = encodeURIComponent(model);
    const encodedUsername = username ? encodeURIComponent(username) : '';

    const response = await fetch(`${apiIpCars}getspots/${encodedMake}/${encodedModel}${encodedUsername ? '?username=' + encodedUsername : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    const dataImages = data.map((item: any) => {
        const urlArr = [];

        for (let i = 0; i < item.images.length; i++) {
            const url = item.images[i] ? `data:image/jpeg;base64,${item.images[i]}` : null;
            urlArr.push(url);
        }

        return { key: item.key, urlArr, notes: item.notes, date: item.date, tags: item.tags };
    });

    return dataImages;
}

export async function update_spots() {
    const response = await fetch(`${apiIpCars}updatespots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}
