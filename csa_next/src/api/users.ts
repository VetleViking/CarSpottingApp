const apiIpUsers = `http://${process.env.NEXT_PUBLIC_DATABASE_IP || "81.191.113.109"}:4000/api/v1/users/`

export async function create_user(username: string, password: string) {
    const response = await fetch(`${apiIpUsers}createuser`, {
        method: 'POST',
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    return await response.json();
}

export async function decode_jwt(token: string) {
    const response = await fetch(`${apiIpUsers}decodejwt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ token })
    });

    return await response.json();
}

export async function get_stats(username: string) {
    const response = await fetch(`${apiIpUsers}getstats/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}

export async function delete_user(username: string) {
    const response = await fetch(`${apiIpUsers}deleteuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ username })
    });

    return await response.json();
}

export async function check_admin(username: string) {
    const response = await fetch(`${apiIpUsers}checkadmin/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    return await response.json();
}