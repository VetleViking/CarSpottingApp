"use client";

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import LoadingAnimation from '@/components/LoadingAnim';
import Spotimage from '@/components/Spotimage';
import { discover } from '@/api/cars';

function ProfileComponent() {
    const [username, setUsername] = useState("");
    const [spots, setSpots] = useState<{
        date: string;
        images: string[];
        key: string;
        notes: string;
        tags: string[];
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
            console.log(res)
            setSpots(res)
        }
    }, [page, sort])

    return <div>
        <Header username={username} />
        <div>
            {spots ? spots.map((item, id) => (
                <div key={id}>
                    <Spotimage
                        images={item.images} tags={item.tags} notes={item.notes} date={item.date} />
                </div>
            )) : <LoadingAnimation text='Loading spots' />}
        </div>
    </div>
}

export default function Profile() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <ProfileComponent />
    </Suspense>
};
