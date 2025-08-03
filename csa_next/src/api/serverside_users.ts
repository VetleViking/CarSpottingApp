import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000";
const apiIpUsers = `${BASE_URL}/api/v1/users`;

async function apiCall(endpoint: string, { method = 'GET', body, query, headers }: ApiCallOptions = {}) {
    let url = `${apiIpUsers}/${endpoint}`;

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

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cookie': cookies().toString()
    };

    let fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: { ...defaultHeaders, ...headers }
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    return response.json();
}

export async function get_username() {
    return apiCall('get_username');
}

export async function check_admin() {
    return apiCall('check_admin');
}

export async function get_stats(username: string) {
    return apiCall(`get_stats/${encodeURIComponent(username)}`);
}

export async function get_current_version() {
    return apiCall('get_current_version');
}

export async function get_release_notes_serverside(currentVersion: string) {
    return apiCall('get_release_notes', { query: { currentVersion } });
}