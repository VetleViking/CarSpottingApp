"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import LoadingAnimation from '@/components/LoadingAnim';
import Spotimage from '@/components/Spotimage';
import { discover, like_spot } from '@/api/cars';
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
    const [prevPage, setPrevPage] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);

    if (!username) ensure_login().then(setUsername);

    useEffect(() => {
        let active = true
        load()
        return () => { active = false }

        async function load() {
            const res = await discover(page, sort)
            if (!active) { return }
            if (page !== prevPage) {
                setPrevPage(page)
                if (res.length === 0) {
                    setReachEnd(true)
                } else {
                    setSpots(s => s.concat(res))
                }
            } else {
                setSpots(res)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page])

    return <div>
        <Header username={username} />
        <div className='flex flex-col gap-4 items-center mt-4 font-ListComponent'>
            <div className='w-min'>
                <div className='mb-2'>
                    <p className='text-white'>Sort by</p>
                    <select value={sort} onChange={e => {
                        setSort(e.target.value as 'recent' | 'hot' | 'top')
                        setPage(0)
                        setReachEnd(false)
                    }}>
                        <option value='recent'>Recent</option>
                        <option value='hot'>Hot</option>
                        <option value='top'>Top</option>
                    </select>
                </div>
                {spots.length ? <>{spots.map((item, id) => {
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
                                <Button text='View' className='py-1' onClick={() => {
                                    window.open(`/spot/${item.make}/${item.model}/${item.key}`)
                                }} />
                                <Button text='share' className='py-1' onClick={() => {
                                    navigator.clipboard.writeText(`https://csa-next.vercel.app/spot/${item.make}/${item.model}/${item.key}`)
                                }} />
                            </div>
                        </div>
                    </div>
                })}
                    <div className='flex justify-center m-4'>
                        {reachEnd ? <p className='text-white text-xl'>No more spots.</p> : <Button text='Load more' onClick={() => setPage(page + 1)} />}
                    </div></> : <LoadingAnimation text='Loading spots' />}
            </div>
        </div>
    </div >
}

export default function Profile() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <ProfileComponent />
    </Suspense>
};
