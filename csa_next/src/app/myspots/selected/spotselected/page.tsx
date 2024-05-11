"use client";

import React, { useState, useEffect } from 'react';
import { get_spotted_images } from '@/api/api';
import { useSearchParams } from "next/navigation";
import Spotimage from '@/components/Spotimage';


function Makes() {
    // TODO: have username in the url for sharing

    const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_spotted_images(make as string, model as string);

            setData(data);
        };

        fetchData();
    }, []);

    if (!data) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    return (
        <div>
            <p className="text-white text-center text-xl">Your spots of {make} {model}:</p>
            {data.map((item: any, id) => (
                <div key={id}>
                    <Spotimage image={item} />
                </div> 
            ))}
        </div>
    );
}

export default Makes;
