"use client";

import React, { useState, useEffect } from 'react';
import { decode_jwt, get_makes, get_spotted_makes } from '@/api/api';
import ListComponent from '@/components/ListComponent';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

function Makes() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);
    const [altUsername, setAltUsername] = useState(username);

    function selectedMake(make: string) {
        if (username) {
            window.location.href = `/makes/selected?make=${make}&username=${username}`;
        } else {
            window.location.href = `/makes/selected?make=${make}`;    
        }
    }

    useEffect(() => {
        if (altUsername) {
            return;
        }
        const encodedUsername = localStorage.getItem('token');

        const fetchData = async () => {            
            const decoded = await decode_jwt(encodedUsername as string);
            setAltUsername(decoded as string);
        };

        fetchData();
    }, []);
    

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
    }, [search]);

    if (!data) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    return (
        <div>
            <Header search={search} setSearch={setSearch} username={altUsername as string} />
            <p className='text-center text-white text-xl mb-4'>Select the make</p>
            <div onClick={() => selectedMake("unknown")}>
                <ListComponent title="Dont know / other" />
            </div>
            {data.map((item: any, id) => (
                <div
                key={id}
                onClick={() => selectedMake(item)}>
                    <ListComponent  title={item} />
                </div>
            ))}
        </div>
    );
}

export default Makes;
