import Header from "@/components/Header";
import { ensure_login_new } from "@/functions/server_functions";
import Button from "@/components/Button";
import HomePageButtons from "@/components/HomePageButtons";

export default async function Home() {
    const username = await ensure_login_new();

    return <div>
        <Header username={username} />
        <div className="mt-8 flex flex-col items-center">
            <p className="text-4xl text-white mb-2">Car Spotting App</p>
            <p className="text-xl text-white">Welcome, {username}</p>
        </div>
        <HomePageButtons username={username} />
    </div>
}
