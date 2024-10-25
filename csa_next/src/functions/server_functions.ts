import { get_username_new } from "@/api/serverside_users";
import { redirect } from "next/navigation";

export async function ensure_login_new() {
    try {
        const data = await get_username_new();
        //if (!data || data.error) redirect('/login')

        console.log('Data:', data);
            
        return data.username as string;
    } catch (error) {
        console.error('Error validating token:', error);
        redirect('/login');
    }
}