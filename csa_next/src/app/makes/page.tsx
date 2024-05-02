"use client";

import React, { useState, useEffect } from 'react';
import Search from '@/components/Search';
import { get_makes } from '@/api/api';
import ListComponent from '@/components/ListComponent';


function Makes() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);

    function selectedMake(make: string) {
        window.location.href = `/makes/selected?make=${make}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_makes(search);
            
            setData(data);
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
            <p className='text-center text-white text-xl mb-4'>Select the make</p>
            <Search search={search} setSearch={setSearch} />
            <div onClick={() => selectedMake("unknown")}>
                <ListComponent title="Dont know / other" />
            </div>
            {data.map((item, id) => (
                <div
                key={id}
                onClick={() => selectedMake(item.name)}>
                    <ListComponent  title={item.name} />
                </div>
            ))}
        </div>
    );
}

export default Makes;
