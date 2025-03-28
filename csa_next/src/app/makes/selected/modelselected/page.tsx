import { ensure_login } from '@/functions/server_functions';
import { get_spotted_images } from '@/api/serverside_cars';
import UploadSpot from '@/components/UploadSpot';
import Spotimage from '@/components/Spotimage';
import Header from '@/components/Header';
import React from 'react';

export default async function Makes({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const resolvedSearchParams = await searchParams;
    const username = resolvedSearchParams.username as string || undefined;
    const key = resolvedSearchParams.key as string || undefined;
    const make = resolvedSearchParams.make as string;
    const model = resolvedSearchParams.model as string;

    const altUsername = await ensure_login();
    const isOwner = username === altUsername;

    const spots = (username && make && model) ? await get_spotted_images(make, model, username, key) as {
        name: string;
        images: string[];
        tags: string[];
        notes: string;
        date: string;
        key: string;
    }[] : [];

    return (
        <div>
            <Header username={altUsername as string} />
            {(!make || !model) ? (
                <p className="text-white text-center text-xl m-4">Make and model not found.</p>
            ) : username && (!Array.isArray(spots) || spots.length == 0) ? (
                <p className="text-white text-center text-xl m-4">No spots found.</p>
            ) : username ? ( 
                <div>
                    <p className="text-white text-center text-xl m-4">
                        {(isOwner ? `Your` : `${username}'s`) + ` spots of ${make} ${model}:`}
                    </p>
                    <div className='flex flex-col items-center gap-2'>
                        {spots.map((item, id) => 
                            <Spotimage
                                key={id}
                                images={item.images.map(image => `https://images.vest.li${image}`)} 
                                tags={item.tags} 
                                notes={item.notes} 
                                date={item.date}
                                spotdata={{ make: make, model: model, key: item.key, isOwner: isOwner }} />
                        )}
                    </div>
                </div> 
            ) : (
                <UploadSpot make={make as string} model={model as string} username={altUsername} />
            )}      
        </div>
    );
}