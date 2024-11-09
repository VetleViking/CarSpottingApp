import { get_username } from "@/api/serverside_users";
import { redirect } from "next/navigation";

export async function ensure_login() {
    try {
        const data = await get_username();
        if (!data || data.error) redirect('/login');

        return data.username as string;
    } catch (error) {
        console.error('Error validating token:', error);
        redirect('/login');
    }
}