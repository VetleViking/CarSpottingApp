import { cookies } from "next/headers";

const apiIpUsers = `http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/`


export async function get_username_new() {
    const response = await fetch(`${apiIpUsers}get_username_new`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function check_admin_new() {
    const response = await fetch(`${apiIpUsers}check_admin_new`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function get_stats(username: string) {
    const response = await fetch(`${apiIpUsers}get_stats/${username}`, {
        method: 'GET',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json',
        }
    });

    return await response.json();
}