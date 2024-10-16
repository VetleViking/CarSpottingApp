import { decode_jwt, get_username_new } from "@/api/users";

/**
 * @returns The username of the logged in user. If the user is not logged in, the user is redirected to the login page.
 * @example 
 * ```ts
 * const username = await ensure_login();
 * ```
 */
export async function ensure_login() {
    if (typeof window !== 'undefined') {
        const encodedUsername = localStorage.getItem('token') || '';

        if (!encodedUsername) {
            window.location.href = '/login';
        }

        const decode = async () => {
            const decoded = await decode_jwt(encodedUsername);

            if (!decoded || decoded.error) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }

            return decoded as string;
        };

        return decode();
    }

    return '';
}

export async function ensure_login_new() {
    if (typeof window !== 'undefined') {
        try {
            get_username_new().then(async (response) => {

            if (!response.ok) {
                window.location.href = '/login';
            }

            const data = await response.json();

            if (!data || data.error) {
                window.location.href = '/login';
            }

            return data; 
            });
        } catch (error) {
            console.error('Error validating token:', error);
            window.location.href = '/login';
        }
    }

    return '';
}