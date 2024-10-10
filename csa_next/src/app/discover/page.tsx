"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import LoadingAnimation from '@/components/LoadingAnim';
import Spotimage from '@/components/Spotimage';
import { discover, edit_spot, like_spot } from '@/api/cars';
import Button from '@/components/Button';

function ProfileComponent() {
    const [username, setUsername] = useState("");
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
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState<'recent' | 'hot' | 'top'>("recent");

    if (!username) ensure_login().then(setUsername);

    useEffect(() => {
        let active = true
        load()
        return () => { active = false }

        async function load() {
            const res = await discover(page, sort)
            if (!active) { return }
            setSpots(res)
        }
    }, [page, sort])

    return <div>
        <Header username={username} />
        <div className='flex flex-col gap-4 items-center mt-4 font-ListComponent'>
            {spots ? spots.map((item, id) => {
                const sinceUploadMs = new Date().getTime() - new Date(item.uploadDate).getTime()
                const sinceUpload = {
                    days: Math.floor(sinceUploadMs / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(sinceUploadMs / (1000 * 60 * 60)),
                    minutes: Math.floor(sinceUploadMs / (1000 * 60)),
                    seconds: Math.floor(sinceUploadMs / (1000))
                }

                return <div key={id} className='bg-white w-max'>
                    <div className='border-b border-black mx-1 mt-1'>
                        <p className='text-center text-2xl '>{item.make} {item.model}</p>
                    </div>
                    <div>
                        <div className='flex'>
                            <p className='p-1'>Uploaded by {item.user}</p>
                            <p className='p-1'>•</p>
                            <p className='p-1'>
                                {sinceUpload.days > 0 ? `${sinceUpload.days} ${sinceUpload.days === 1 ? "day" : "days"}` :
                                    sinceUpload.hours > 0 ? `${sinceUpload.hours} ${sinceUpload.hours === 1 ? "hour" : "hours"}` :
                                        sinceUpload.minutes > 0 ? `${sinceUpload.minutes} ${sinceUpload.minutes === 1 ? "minute" : "minutes"}` :
                                            `${sinceUpload.seconds} ${sinceUpload.seconds === 1 ? "second" : "seconds"}`} ago
                            </p>
                        </div>
                        <Spotimage
                            images={item.images} tags={item.tags} notes={item.notes} date={item.date} />
                        <div className='flex items-center mb-1 gap-2'>
                            <p className='p-1 text-xl'>{item.likes} {item.likes == 1 ? "like" : "likes"}</p>
                            <Button text={item.likedByUser ? "Remove like" : "Like"} className='py-1' onClick={() => {
                                like_spot(item.make, item.model, item.key, item.user).then(() => {
                                    setSpots(spots.map(spot => {
                                        return spot.key === item.key ? { ...spot, likedByUser: !spot.likedByUser, likes: spot.likedByUser ? spot.likes - 1 : spot.likes + 1 } : spot
                                    }));
                                })
                            }} />
                        </div>
                    </div>
                </div>
            }) : <LoadingAnimation text='Loading spots' />}
        </div>
    </div >
}

export default function Profile() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <ProfileComponent />
    </Suspense>
};
