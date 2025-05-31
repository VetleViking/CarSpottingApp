import { decode_jwt} from "@/api/users";

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

export const getTimeAgo = (date: string) => {
    const sinceUploadMs = new Date().getTime() - new Date(date).getTime();
    const years = Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sinceUploadMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((sinceUploadMs / (1000 * 60)) % 60);
    const seconds = Math.floor((sinceUploadMs / 1000) % 60);

    return years > 0
        ? `${years} ${years === 1 ? 'year' : 'years'} ago`
        : months > 0
        ? `${months} ${months === 1 ? 'month' : 'months'} ago` 
        : days > 0
        ? `${days} ${days === 1 ? 'day' : 'days'} ago`
        : hours > 0
        ? `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
        : minutes > 0
        ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
        : seconds > 0
        ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
        : 'Just now';
}