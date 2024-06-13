"use client";

import { add_model, get_models, get_spotted_make_percentage, get_spotted_models } from "@/api/api";
import { ensure_login } from "@/functions/functions";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from 'react'

function MakeSelectedComponent() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make') as string;
    const username = searchParams.get('username');
    const [altUsername, setAltUsername] = useState("");
    const [newModel, setNewModel] = useState("");
    const [percentageData, setPercentageData] = useState<{ percentage: number; numSpots: number; numModels: number }> ();

    function addModelHandler(model: string) {
        add_model(make, model).then(() => window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}`);
    }
    function selectedModel(make: string, model: string) {
        if (username) {
            window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}&username=${username}`;
        } else {
            window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}`;
        }
    }

    ensure_login().then((username) => setAltUsername(username));

    useEffect(() => {
        const fetchData = async () => {
            let data = [];
            let percentageData = {};
            
            if (username) {
                data = await get_spotted_models(make as string, search, username);
                percentageData = await get_spotted_make_percentage(make as string, username);
                setPercentageData(percentageData as { percentage: number; numSpots: number; numModels: number });
            } else {
                data = await get_models(make as string, search);
            }

            setData(data);

        };

        fetchData();
    }, [search, make, username]);

    if (!data || !altUsername) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <Header search={search} setSearch={setSearch} username={altUsername as string}/>
            <p className="text-white text-center text-2xl mb-1 mt-4">Selected Make: {make}</p>
            <p className="text-white text-center text-xl mb-4">{username ? `${username == altUsername ? "your" : username + "'s"} spots of ${make}'s:` : `${make}'s models:`}</p>
            {(username && percentageData) && <p className="text-white text-center mb-4 font-ListComponent">{username == altUsername ? "You" : username} have spotted {percentageData.numSpots} out of the {percentageData.numModels} models in the database, or {percentageData.percentage}%.</p>}
            {!username &&<div className='w-full flex items-center justify-center gap-4 mb-4'>
                <input
                    className='font-ListComponent border border-black p-1 h-full rounded-md'
                    type='text'
                    placeholder='Other (add model)'
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                />
                <button
                    className='bg-[#e72328] text-white py-2 px-2 border border-black italic'
                    onClick={() => addModelHandler(newModel)}>Add new model</button>
            </div>}
            {Array.isArray(data) && data.length > 0 ? (
                data.map((item: any, id) => (
                    <div 
                    key={id}
                    onClick={() => {selectedModel(item.make, item.model)}}>
                        <ListComponent title={make == "unknown" ? item.make + " " + item.model : item.model} />
                    </div>
                ))
            ) : (
                <div className="text-white text-center">No models found</div>
                
            )}
        </div>
    );
};

export default function MakeSelected() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MakeSelectedComponent />
        </Suspense>
    );
}