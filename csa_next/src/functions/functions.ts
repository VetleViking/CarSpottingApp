import { decode_jwt } from "@/api/api";

export async function ensure_login() {
    if (typeof window !== 'undefined') {
        const encodedUsername = localStorage.getItem('token');

        const decode = async () => {
            const decoded = await decode_jwt(encodedUsername as string);

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