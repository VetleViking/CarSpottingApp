"use client";

import { add_model, decode_jwt, get_models, get_spotted_models } from "@/api/api";
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

    useEffect(() => {
        if (altUsername) {
            return;
        }
        const encodedUsername = localStorage.getItem('token');

        const fetchData = async () => {            
            const decoded = await decode_jwt(encodedUsername as string);
            setAltUsername(decoded as string);
        };

        fetchData();
    });
    
    useEffect(() => {
        const fetchData = async () => {
            let data = [];
            
            if (username) {
                data = await get_spotted_models(make as string, search, username);
            } else {
                data = await get_models(make as string, search);
            }

            setData(data);
        };

        fetchData();
    }, [search, make, username]);

    if (!data) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <Header search={search} setSearch={setSearch} username={altUsername as string}/>
            <p className="text-white text-center text-2xl mb-1 mt-4">Selected Make: {make}</p>
            <p className="text-white text-center text-xl mb-4">{username ? `${username}'s spots of ${make}'s:` : `${make}'s models:`}</p>
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