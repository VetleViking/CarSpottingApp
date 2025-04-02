import { get_spotted_make_percentage } from "@/api/serverside_cars";
import { ensure_login } from "@/functions/server_functions";
import MakeSelectedClient from "./MakeselectedClient";
import AskAi from "@/components/AskAi";

export default async function MakeSelected({searchParams}: SearchParams) {
    const altUsername = await ensure_login();

    const resolvedSearchParams = await searchParams;
    const username = resolvedSearchParams.username as string || undefined;
    const make = resolvedSearchParams.make as string;

    const percentageData = (username && make != "unknown") ? await get_spotted_make_percentage(make, username) as { 
        percentage: number; 
        numSpots: number; 
        numModels: number 
    } : undefined;

    return (
        <div>
            <AskAi />
            <MakeSelectedClient altUsername={altUsername as string} username={username} make={make}>
                <p className="text-white text-center text-2xl mb-1 mt-4">
                    Selected Make: {make}
                </p>
                <p className="text-white text-center text-xl mb-4">
                    {username ? `${username == altUsername ? "your" : username + "'s"} spots of ${make}'s:` : `${make}'s models:`}
                </p>
                {(username && percentageData) && (
                    <p className="text-white text-center mb-4 font-ListComponent">
                        {username == altUsername ? "You" : username} have spotted {percentageData.numSpots} out of the {percentageData.numModels} models in the database, or {percentageData.percentage}%.
                    </p>
                )}
            </MakeSelectedClient>
        </div>
    );
};