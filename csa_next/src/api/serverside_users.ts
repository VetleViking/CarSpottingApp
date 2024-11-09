import { cookies } from "next/headers";

const apiIpUsers = `${process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000"}/api/v1/users/`


export async function get_username() {
    const response = await fetch(`${apiIpUsers}get_username`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function check_admin() {
    const response = await fetch(`${apiIpUsers}check_admin`, {
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
        credentials: 'include',
        headers: {
            Cookie: cookies().toString(),
            'Content-Type': 'application/json',
        }
    });

    return await response.json();
}