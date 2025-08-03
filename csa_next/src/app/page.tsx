import Header from "@/components/Header";
import { ensure_login } from "@/functions/server_functions";
import HomePageButtons from "@/components/HomePageButtons";
import ReleaseNotes from "@/components/ReleaseNotes";
import { get_current_version, get_release_notes_serverside } from "@/api/serverside_users";

export default async function Home() {
    const username = await ensure_login();
    const currentVersion = await get_current_version();
    const releaseNotes = await get_release_notes_serverside(currentVersion);

    return (
        <div>
            <Header username={username} />
            <div className="mt-8 flex flex-col items-center">
                <p className="text-4xl text-white mb-2">Car Spotting App</p>
                <p className="text-xl text-white">Welcome, {username}</p>
            </div>
            <HomePageButtons username={username} />
            <ReleaseNotes currentVersion={currentVersion} releaseNotes={releaseNotes} />
        </div>
    );
}
