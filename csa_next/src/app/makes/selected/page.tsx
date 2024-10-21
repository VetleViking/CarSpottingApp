import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import { ensure_login } from "@/functions/functions";
import { get_models, get_spotted_make_percentage, get_spotted_models } from "@/api/cars";
import AskAi from "@/components/AskAi";
import AddNew from "@/components/AddNew";
import SearchReg from "@/components/SearchReg";
import MakeSelectedClient from "./MakeselectedClient";

export default function MakeSelected() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make') as string;
    const username = searchParams.get('username');
    const [altUsername, setAltUsername] = useState("");
    const [percentageData, setPercentageData] = useState<{ percentage: number; numSpots: number; numModels: number }>();

    
    if (!altUsername) ensure_login().then(setAltUsername);

   

    return <div>
        <MakeSelectedClient altUsername={altUsername as string} username={altUsername as string} />
    </div>
};