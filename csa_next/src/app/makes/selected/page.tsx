"use client";

import { get_models, get_models_redis } from "@/api/api";
import ListComponent from "@/components/ListComponent";
import Search from "@/components/Search";
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
                data = await get_models_redis("", search);    
            } else {
                data = await get_models_redis(make as string, search);
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
            <p className="text-white text-center text-xl">Selected Make: {make}</p>
            <p className="text-white text-center text-xl">{make}'s models:</p>
            {Array.isArray(data) && data.length > 0 ? (
                data.map((item: any, id) => (
                    <div 
                    key={id}
                    onClick={() => {selectedModel(item.model)}}>
                        <ListComponent title={make == "unknown" ? item.make + " " + item.model : item.model} />
                    </div>
                ))
            ) : (
                <div className="text-white text-center">No models found</div>
            )}
        </div>
    );
};