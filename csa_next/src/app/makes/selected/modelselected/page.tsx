import React from 'react';
import { useSearchParams } from "next/navigation";
import UploadSpot from '@/components/UploadSpot';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';
import { get_spotted_images } from '@/api/cars';
import { ensure_login_new } from '@/functions/server_functions';

export default async function Makes() {
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const username = searchParams.get('username');
    const altUsername = await ensure_login_new();
    const isOwner = username === altUsername;

    const spots = (username && make && model) ? await get_spotted_images(make, model, username) as {
        name: string;
        urlArr: string[];
        tags: string[];
        notes: string;
        date: string;
        key: string;
    }[] : [];

    if (!username) return <div>
        <Header username={altUsername as string} />
        <UploadSpot make={make as string} model={model as string} />
    </div>;

    return <div>
        <Header username={altUsername as string} />
        <p className="text-white text-center text-xl m-4">{(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}</p>
        <div className='flex flex-col items-center gap-2'>
            {(username && make && model) && spots.map((item, id) => 
                <div key={id}>
                    <Spotimage
                        images={item.urlArr} tags={item.tags} notes={item.notes} date={item.date}
                        spotdata={{ make: make, model: model, key: item.key, isOwner: isOwner }} />
                </div>
            )}
        </div>
    </div>
}