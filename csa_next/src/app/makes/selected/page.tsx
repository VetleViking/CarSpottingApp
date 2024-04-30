"use client";

import { get_models } from "@/api/api";
import ListComponent from "@/components/ListComponent";
import Search from "@/components/Search";
import { get } from "http";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MakeSelected() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');

    function selectedModel(model: string) {
        window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}`;
    }
    
    useEffect(() => {
        const fetchData = async () => {
            let data = [];
            if (make == "unknown") {
                data = await get_models("", search);    
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
            <Search search={search} setSearch={setSearch} />
            <h1 className="text-white text-center">Selected Make: {make}</h1>
            <h2 className="text-white text-center">{make}'s models:</h2>
            {data.map((item, id) => (
                <div 
                key={id}
                onClick={() => {selectedModel(item.model)}}>
                    <ListComponent title={item.model} />
                </div>
            ))}
        </div>
    );
};