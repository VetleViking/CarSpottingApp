import { useSearchParams } from "next/navigation";
import MakeSelectedClient from "./MakeselectedClient";
import { ensure_login_new } from "@/functions/server_functions";
import { get_spotted_make_percentage_new } from "@/api/serverside_cars";

export default async function MakeSelected() {
    const altUsername = await ensure_login_new();
    
    const searchParams = useSearchParams();
    const username = searchParams.get('username') as string;
    const make = searchParams.get('make') as string;

    const percentageData = await get_spotted_make_percentage_new(make, username) as { percentage: number; numSpots: number; numModels: number };

    return <div>
        <MakeSelectedClient altUsername={altUsername as string} username={username as string} make={make} percentageData={percentageData} />
    </div>
};