"use client";

import { get_models, get_spotted_models } from "@/api/cars";
import AddNew from "@/components/AddNew";
import AskAi from "@/components/AskAi";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import SearchReg from "@/components/SearchReg";
import { useEffect, useState } from "react";

interface MakeSelectedClientProps {
    altUsername: string;
    username?: string;
    make: string;
    percentageData?: {
        numSpots: number;
        numModels: number;
        percentage: number;
    };
};

const MakeSelectedClient = ({altUsername, username, make, percentageData}: MakeSelectedClientProps) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);

    function selectedModel(make: string, model: string) {
        if (username) window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}&username=${username}`;
        else window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}`;
    }

    useEffect(() => {
        const fetchData = () => {
            username ? get_spotted_models(make as string, search, username).then(setData) 
                     : get_models(make as string, search).then(setData);
        };

        fetchData();
    }, [search, make, username]);

    return <div>
    <AskAi />
    <Header search={search} setSearch={setSearch} username={altUsername as string} />
    <p className="text-white text-center text-2xl mb-1 mt-4">Selected Make: {make}</p>
    <p className="text-white text-center text-xl mb-4">{username ? `${username == altUsername ? "your" : username + "'s"} spots of ${make}'s:` : `${make}'s models:`}</p>
    {(username && percentageData) && <p className="text-white text-center mb-4 font-ListComponent">{username == altUsername ? "You" : username} have spotted {percentageData.numSpots} out of the {percentageData.numModels} models in the database, or {percentageData.percentage}%.</p>}
    {!username && <div className='flex gap-2 mx-1 mb-4 flex-wrap md:flex-nowrap'>
        <AddNew type='model' make={make} />
        <SearchReg />
    </div>}
    {Array.isArray(data) && data.length > 0
        ? data.map((item: any, id) => <div
            key={id}
            onClick={() => { selectedModel(item.make, item.model) }}>
            <ListComponent title={make == "unknown" ? item.make + " " + item.model : item.model} />
        </div>)
        : <div className="text-white font-ListComponent px-1 text-nowrap text-center">No models found</div>}
</div>
};

export default MakeSelectedClient;