const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000";
const apiBase = `${BASE_URL}/api/v1/users`;

async function apiCall(endpoint: string, { method = 'GET', body, query, headers }: ApiCallOptions = {}) {
    let url = `${apiBase}/${endpoint}`;

    // Make query string
    if (query && Object.keys(query).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        }
        url += `?${queryParams.toString()}`;
    }

    let fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(headers || {})
        }
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    return response.json();
}

export async function create_user(username: string, password: string) {
    return apiCall('create_user', {
        method: 'POST',
        body: { username, password }
    });
}

export async function login(username: string, password: string) {
    return apiCall('login', {
        method: 'POST',
        body: { username, password }
    });
}

export async function logout() {
    return apiCall('logout', {
        method: 'POST'
    });
}

export async function delete_user() {
    return apiCall('delete_user', {
        method: 'POST'
    });
}

export async function decode_jwt(token: string) {
    return apiCall('decodejwt', {
        method: 'POST',
        body: { token }
    });
}

export async function check_admin() {
    return apiCall(`check_admin`);
}

export async function add_admin(username: string) {
    return apiCall(`add_admin`, {
        method: 'POST',
        body: { admin_username: username }
    });
}

export async function add_release_notes(notes: releaseNotesComponent[]) {
    return apiCall(`add_release_notes`, {
        method: 'POST',
        body: { notes }
    });
}

export async function update_users() {
    return apiCall(`update_users`, {
        method: 'POST'
    });
}
