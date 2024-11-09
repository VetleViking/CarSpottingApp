const apiIpUsers = `${process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000"}/api/v1/users/`

export async function create_user(username: string, password: string) {
    const response = await fetch(`${apiIpUsers}create_user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function login(username: string, password: string) {
    const response = await fetch(`${apiIpUsers}login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function delete_user() {
    const response = await fetch(`${apiIpUsers}delete_user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}


export async function decode_jwt(token: string) {
    const response = await fetch(`${apiIpUsers}decodejwt`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}

export async function check_admin(username: string) {
    const response = await fetch(`${apiIpUsers}checkadmin/${username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}