"use client";

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';
import { get_spotted_images } from '@/api/cars';
import { ensure_login } from '@/functions/functions';

function MakesComponent() {
    const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const username = searchParams.get('username');
    const [isOwner, setIsOwner] = useState(false);
    const [altUsername, setAltUsername] = useState("");

    if (!altUsername) {
        ensure_login().then((user) => {
            setAltUsername(user as string);

            if (username) {
                setIsOwner(username === user as string);
            }
        });
    }

    useEffect(() => {
        if (username) {
            const fetchData = async () => {
                const data = await get_spotted_images(make as string, model as string, username);
                setData(data);
            };

            fetchData();
        }
    }, [username, make, model]);

    if (!altUsername) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    if (username) {
        return (
            <div>
                <Header username={username as string} />
                <p className="text-white text-center text-xl m-4">{(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}</p>
                <div className='flex flex-col items-center gap-2'>
                    {data.map((item: any, id) => (
                        <div key={id}>
                            <Spotimage images={item.urlArr} notes={item.notes? item.notes : null} date={item.date? item.date : null} deletedata={{ make: make as string, model: model as string, key: item.key, isOwner: isOwner }}/>
                        </div> 
                    ))}
                </div>
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

export default function Makes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MakesComponent />
        </Suspense>
    );
};
