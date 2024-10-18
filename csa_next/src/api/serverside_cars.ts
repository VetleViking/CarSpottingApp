import { cookies } from "next/headers";

const apiIpCars = `http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/cars/`

export async function get_spotted_images_new(make: string, model: string, username?: string) {
    const encodedMake = encodeURIComponent(make);
    const encodedModel = encodeURIComponent(model);
    const encodedUsername = username ? encodeURIComponent(username) : null;

    const response = await fetch(`${apiIpCars}get_spots_new/${encodedMake}/${encodedModel}${encodedUsername ? '?username=' + encodedUsername : ''}`, {
        method: 'GET',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
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