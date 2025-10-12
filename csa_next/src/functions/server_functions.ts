import { get_username } from "@/api/serverside_users";
import { redirect } from "next/navigation";

export async function ensure_login() {
    try {
        const data = await get_username();

        if (!data || data.error) {
            redirect("/login");
        }

        return data.username as string;
    } catch {
        // redirect throws an error, so wont log it
        redirect("/login");
    }
}
