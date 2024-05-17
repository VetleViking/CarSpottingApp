"use client";

import { decode_jwt, get_models, get_spotted_models } from "@/api/api";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MakeSelected() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const username = searchParams.get('username');
    const [altUsername, setAltUsername] = useState(username);

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
    }, []);
    
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
    }, [search, make]);

    if (!data) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <Header search={search} setSearch={setSearch} username={altUsername as string}/>
            <p className="text-white text-center text-xl">Selected Make: {make}</p>
            <p className="text-white text-center text-xl">{username ? `${username}'s spots of ${make}'s:` : `${make}'s models:`}</p>
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