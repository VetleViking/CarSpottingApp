import { cookies } from "next/headers";

const apiIpCars = `${process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000"}/api/v1/cars/`

export async function get_spotted_images_new(make: string, model: string, username?: string) {
    const encodedMake = encodeURIComponent(make);
    const encodedModel = encodeURIComponent(model);
    const encodedUsername = username ? encodeURIComponent(username) : null;

    const response = await fetch(`${apiIpCars}get_spots_new/${encodedMake}/${encodedModel}${encodedUsername ? '?username=' + encodedUsername : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();

    // const data = await response.json();

    // const dataImages = data.map((item: any) => {
    //     const urlArr = [];

    //     for (let i = 0; i < item.images.length; i++) {
    //         const url = item.images[i] ? `data:image/jpeg;base64,${item.images[i]}` : null;
    //         urlArr.push(url);
    //     }

    //     return { key: item.key, urlArr, notes: item.notes, date: item.date, tags: item.tags };
    // });

    // return dataImages;
}

export async function get_spotted_make_percentage_new(make: string, username?: string) {
    const response = await fetch(`${apiIpCars}spots/${make}/percentage_new${username ? '?username=' + username : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json()
}
