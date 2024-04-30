"use client";

import { get_models } from "@/api/api";
import Search from "@/components/Search";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MakeSelected() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await get_models(make as string, search);
            
            setData(data);
        };

        fetchData();
    }, []);

    if (!data) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <Search search={search} setSearch={setSearch} />
            <h1>Selected Make: {make}</h1>
            <h2>Models</h2>
            {data.map((item, id) => (
                <div key={id}>
                    <h3>{item.model}</h3>
                </div>
            ))}
        </div>
    );
};