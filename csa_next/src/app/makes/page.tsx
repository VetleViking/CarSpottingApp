"use client";

import React, { useState, useEffect } from 'react';
import { add_make, get_makes, get_spotted_makes } from '@/api/cars';
import ListComponent from '@/components/ListComponent';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';

function MakesComponent() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);
    const [altUsername, setAltUsername] = useState("");
    const [newMake, setNewMake] = useState("");

    function selectedMake(make: string) {
        if (username) {
            window.location.href = `/makes/selected?make=${make}&username=${username}`;
        } else {
            window.location.href = `/makes/selected?make=${make}`;    
        }
    }

    function addMakeHandler(make: string) {
        add_make(make).then(() => window.location.href = `/makes/selected?make=${make}`);
    }

    if (!altUsername) {
        ensure_login().then((username) => setAltUsername(username));
    }
    
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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>
                <Header search={search} setSearch={setSearch} username={altUsername} />
                <p className='text-center text-white text-3xl my-4'>Select the make</p>
                <div className='flex gap-2 mb-4 flex-wrap md:flex-nowrap'>
                    <div onClick={() => selectedMake("unknown")} className='w-full'>
                        <ListComponent title="Dont know" />
                    </div>
                    {!username && <div className='w-full flex items-center justify-center gap-4 mx-1'>
                        <input
                            className='font-ListComponent border border-black p-1 w-full h-full rounded-md'
                            type='text'
                            placeholder='Other (add make)'
                            value={newMake}
                            onChange={(e) => setNewMake(e.target.value)}
                        />
                        <button
                            className='bg-[#e72328] text-white p-2 border border-black italic text-nowrap'
                            onClick={() => addMakeHandler(newMake)}>Add new make</button>
                    </div>}
                </div>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item: any, id) => (
                    <div
                    key={id}
                    onClick={() => selectedMake(item)}>
                        <ListComponent  title={item} />
                    </div>
                ))): (<p className='text-white font-ListComponent px-1 text-nowrap'>Loading...</p>)}
                
                
            </div>
        </Suspense>
    );
}

export default function Makes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MakesComponent />
        </Suspense>
    );
};
