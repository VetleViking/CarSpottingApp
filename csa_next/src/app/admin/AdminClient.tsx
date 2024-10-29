"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { fix_spot, fix_spots, update_spots } from '@/api/cars';
import Spotimage from '@/components/Spotimage';

export default function AdminClientSide() {
    const [spots, setSpots] = useState<{
        date: string;
        images: string[];
        key: string;
        notes: string;
        tags: string[];
        user: string;
        make: string;
        model: string;
        likes: number;
        uploadDate: string;
        likedByUser: boolean;
    }[]>([]);
    const [atSpot, setAtSpot] = useState(0);
    const [files, setFiles] = useState<FileList | null>(null);

    return <>
        <Button
            onClick={update_spots}
            text='Update spots'
            className='text-xl m-4'
        />
        <div>
            <p className='text-white text-center p-2 text-xl italic font-medium'>Create Release Notes</p>
            <p>implement later</p>
        </div>
        <div>
            <Button
                onClick={() => fix_spots().then((spots) => setSpots(spots))}
                text='Get fix spots'
                className='text-xl m-4'
            />
                {spots && spots.length && <div className='flex flex-col gap-2 items-center'>
                    <p className='text-white text-center text-xl m-4'>{spots[atSpot].make} {spots[atSpot].model}</p>
                    <div className='flex flex-col gap-2 items-center'>
                        <p className='text-white text-center text-xl m-4'>Spot {atSpot}</p>
                        <p className='text-white text-center text-xl m-4'>Date: {spots[atSpot].date}</p>
                        <p className='text-white text-center text-xl m-4'>Notes: {spots[atSpot].notes}</p>
                        <p className='text-white text-center text-xl m-4'>Tags: {spots[atSpot].tags.join(', ')}</p>
                        <p className='text-white text-center text-xl m-4'>User: {spots[atSpot].user}</p>
                        <p className='text-white text-center text-xl m-4'>Likes: {spots[atSpot].likes}</p>
                        <p className='text-white text-center text-xl m-4'>Upload Date: {spots[atSpot].uploadDate}</p>
                        <p className='text-white text-center text-xl m-4'>Liked by user: {spots[atSpot].likedByUser ? 'Yes' : 'No'}</p>
                    </div>
                    <input
                        className="rounded-sm bg-black p-1 mb-2 border border-[#9ca3af] text-[#9ca3af] font-ListComponent"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => setFiles(e.target.files)} />
                    <Spotimage images={files ? Array.from(files).map(file => URL.createObjectURL(file)) : []} />
                    <Button
                        onClick={() => {
                            fix_spot(spots[atSpot].make, spots[atSpot].model, spots[atSpot].user, spots[atSpot].key, files);
                            setAtSpot(atSpot + 1);
                            setFiles(null);
                        }}
                        text='Update spot'
                        className='text-xl m-4'
                    />
                </div>}
        </div>
    </>
}