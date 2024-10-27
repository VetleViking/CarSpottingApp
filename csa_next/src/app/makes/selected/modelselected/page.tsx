import React from 'react';
import UploadSpot from '@/components/UploadSpot';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';
import { ensure_login_new } from '@/functions/server_functions';
import { get_spotted_images_new } from '@/api/serverside_cars';

export default async function Makes({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const resolvedSearchParams = await searchParams;
    const username = resolvedSearchParams.username as string || undefined;
    const make = resolvedSearchParams.make as string;
    const model = resolvedSearchParams.model as string;
    const altUsername = await ensure_login_new();
    const isOwner = username === altUsername;

    const spots = (username && make && model) ? await get_spotted_images_new(make, model, username) as {
        name: string;
        images: string[];
        tags: string[];
        notes: string;
        date: string;
        key: string;
    }[] : [];

    if (!username) return <div>
        <Header username={altUsername as string} />
        <UploadSpot make={make as string} model={model as string} username={altUsername} />
    </div>;

    return <div>
        <Header username={altUsername as string} />
        <p className="text-white text-center text-xl m-4">{(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}</p>
        <div className='flex flex-col items-center gap-2'>
            {(username && make && model) && spots.map((item, id) => 
                <div key={id}>
                    <Spotimage
                        images={item.images} tags={item.tags} notes={item.notes} date={item.date}
                        spotdata={{ make: make, model: model, key: item.key, isOwner: isOwner }} />
                </div>
            )}
        </div>
    </div>
}