"use client";

import React, { useState, useEffect } from 'react';
import { add_make, get_makes, get_spotted_makes, regnr_info } from '@/api/cars';
import ListComponent from '@/components/ListComponent';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import AskAi from '@/components/AskAi';
import LoadingAnimation from '@/components/LoadingAnim';
import Button from '@/components/Button';
import SearchReg from '@/components/SearchReg';
import AddNew from '@/components/AddNew';

function MakesComponent() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);
    const [altUsername, setAltUsername] = useState("");

    function selectedMake(make: string) {
        username
            ? window.location.href = `/makes/selected?make=${make}&username=${username}`
            : window.location.href = `/makes/selected?make=${make}`;
    }

    if (!altUsername) ensure_login().then(setAltUsername);

    useEffect(() => {
        const fetchData = async () => {
            if (username) {
                const data = await get_spotted_makes(search, username);
                setData(data);
            } else {
                const data = await get_makes(search);
                setData(data);
            }
        };

        fetchData();
    }, [search, username]);

    return <div>
        <AskAi />
        <div>
            <Header search={search} setSearch={setSearch} username={altUsername} />
            <p className='text-center text-white text-3xl my-4'>Select the make</p>
            <div className='flex gap-2 mx-1 mb-4 flex-wrap md:flex-nowrap'>
                <div onClick={() => selectedMake("unknown")} className='w-full mx-[-0.25rem]'>
                    <ListComponent title="Dont know" />
                </div>
                {!username && <AddNew type='make' />}
                {!username && <SearchReg />}
            </div>
            {Array.isArray(data) && data.length > 0 ? data.map((item: any, id) => <div
                key={id}
                onClick={() => selectedMake(item)}>
                <ListComponent title={item} />
            </div>) : <p className='text-white font-ListComponent px-1 text-nowrap text-center'>No makes found.</p>}
        </div>
    </div>
}

export default function Makes() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <MakesComponent />
    </Suspense>
};
