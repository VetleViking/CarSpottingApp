"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';
import { decode_jwt, get_spotted_images } from '@/api/api';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';


function Makes() {
    const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const username = searchParams.get('username');
    const [isOwner, setIsOwner] = useState(false);
    const [altUsername, setAltUsername] = useState(username);

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
                <Header username={username as string} />
                <p className="text-white text-center text-xl">{(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}</p>
                {data.map((item: any, id) => (
                    <div key={id}>
                        <Spotimage image={item.url} deletedata={{ make: make as string, model: model as string, key: item.key, isOwner: isOwner }}/>
                    </div> 
                ))}
            </div>
        );
    }

    return (
        <div>
            <Header username={altUsername as string} />
            <UploadSpot make={make as string} model={model as string} />
        </div>
    );
}

export default Makes;
