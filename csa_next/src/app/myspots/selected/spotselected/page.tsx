"use client";

import React, { useState, useEffect } from 'react';
import { get_spotted_images } from '@/api/api';
import { useSearchParams } from "next/navigation";


function Makes() {
    const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_spotted_images(make as string, model as string);

            console.log(data);

            const images = data.map((item: any) => {
                const buffer = new Uint8Array(item.data).buffer;
                const blob = new Blob([buffer], { type: 'image/jpeg' });
                return URL.createObjectURL(blob);
            });

            setData(images);
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
            <h1 className="text-white text-center">Selected Make: {make}</h1>
            <h2 className="text-white text-center">Selected Model: {model}</h2>
            <p className="text-white text-center text-xl">Spotted images:</p>
            {data.map((item: any, id) => (
                <div key={id}>
                    <img className='w-64 m-4' src={item} alt="spotted" />
                </div> 
            ))}
        </div>
    );
}

export default Makes;
