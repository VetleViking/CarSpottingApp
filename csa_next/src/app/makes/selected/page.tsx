"use client";

import { get_models } from "@/api/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MakeSelected() {
    const [data, setData] = useState<{ model: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');

    async function fetchData() {
        const data = await get_models(make as string);
        setData(data);
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    if (!data) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
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