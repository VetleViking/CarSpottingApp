"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';
import { decode_jwt, get_spotted_images } from '@/api/api';
import Spotimage from '@/components/Spotimage';


function Makes() {
    const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const username = searchParams.get('username');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (username) {
            const encodedUsername = localStorage.getItem('token');

            if (!encodedUsername) {
                window.location.href = '/login';
            }
            
            const decode = async () => {
                const decoded = await decode_jwt(encodedUsername as string);
                setIsOwner(decoded === username);
            };

            decode();

            const fetchData = async () => {
                const data = await get_spotted_images(make as string, model as string, username);

                setData(data);
            };

            fetchData();
        }
    }, []);

    if (!data) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    if (username) {
        return (
            <div>
                <p className="text-white text-center text-xl">{username}'s spots of {make} {model}:</p>
                {data.map((item: any, id) => (
                    <div key={id}>
                        <Spotimage image={item} isOwner={isOwner} />
                    </div> 
                ))}
            </div>
        );
    }

    return (
        <div>
            <UploadSpot make={make as string} model={model as string} />
        </div>
    );
}

export default Makes;
