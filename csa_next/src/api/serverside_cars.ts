import { cookies } from "next/headers";

const apiIpCars = `${process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000"}/api/v1/cars/`

export async function get_spotted_images(make: string, model: string, username?: string) {
    const encodedMake = encodeURIComponent(make);
    const encodedModel = encodeURIComponent(model);
    const encodedUsername = username ? encodeURIComponent(username) : null;

    const response = await fetch(`${apiIpCars}get_spots/${encodedMake}/${encodedModel}${encodedUsername ? '?username=' + encodedUsername : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function get_spotted_make_percentage(make: string, username?: string) {
    const response = await fetch(`${apiIpCars}spots/${make}/percentage${username ? '?username=' + username : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json()
}
