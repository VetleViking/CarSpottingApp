import { decode_jwt } from "@/api/users";

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