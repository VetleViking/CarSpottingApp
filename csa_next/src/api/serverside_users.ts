import { cookies } from "next/headers";

const apiIpUsers = `http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/`

export async function get_username_new() {
    console.log('get_username_new');

    const response = await fetch(`${apiIpUsers}getusernamenew`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}