"use client";

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';
import { get_spotted_images } from '@/api/cars';
import { ensure_login } from '@/functions/functions';
import LoadingAnimation from '@/components/LoadingAnim';

function MakesComponent() {
    const [data, setData] = useState<{
        name: string;
        urlArr: string[];
        tags: string[];
        notes: string;
        date: string;
        key: string;
    }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    const username = searchParams.get('username');
    const [isOwner, setIsOwner] = useState(false);
    const [altUsername, setAltUsername] = useState("");

    if (!altUsername) ensure_login().then((user) => {
        setAltUsername(user);

        username && setIsOwner(username === user)
    });

    useEffect(() => {
        if (username && make && model) {
            const fetchData = async () => {
                const data = await get_spotted_images(make, model, username);
                setData(data);
            };

            fetchData();
        }
    }, [username, make, model]);

    if (!username) return <div>
        <Header username={altUsername as string} />
        <UploadSpot make={make as string} model={model as string} />
    </div>;

    return <div>
        <Header username={altUsername as string} />
        <p className="text-white text-center text-xl m-4">{(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}</p>
        <div className='flex flex-col items-center gap-2'>
            {data.map((item, id) => (
                <div key={id}>
                    <Spotimage
                        images={item.urlArr} tags={item.tags} notes={item.notes} date={item.date}
                        spotdata={{ make: make || "", model: model || "", key: item.key, isOwner: isOwner }} />
                </div>
            ))}
        </div>
    </div>
}

export default function Makes() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <MakesComponent />
    </Suspense>
};
