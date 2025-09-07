import { ensure_login } from '@/functions/server_functions';
import { get_spotted_images } from '@/api/serverside_cars';
import UploadSpot from '@/components/UploadSpot';
import FullSpot from '@/components/FullSpot';
import Header from '@/components/Header';
import React from 'react';

export default async function Spots({searchParams}: SearchParams) {
    const resolvedSearchParams = await searchParams;
    const username = resolvedSearchParams.username as string || undefined;
    const key = resolvedSearchParams.key as string || undefined;
    const make = resolvedSearchParams.make as string;
    const model = resolvedSearchParams.model as string;

    const altUsername = await ensure_login();
    const isOwner = username === altUsername;

    const spots = (username && make && model) ? await get_spotted_images(make, model, username, key) as Spot[] : [];

    return (
        <div>
            <Header username={altUsername} />
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
                            <FullSpot
                                username={altUsername}
                                key={id} 
                                spot={item} 
                                isAdmin={false}
                            />
                        )}
                    </div>
                </div> 
            ) : (
                <UploadSpot make={make as string} model={model as string} username={altUsername} />
            )}      
        </div>
    );
};
