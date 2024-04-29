"use client";

import React, { useState, useEffect } from 'react';
import Search from '@/components/Search';
import { get_makes } from '@/api/api';


function Makes() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);

    function selectedMake(make: string) {
        console.log(make);
        
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
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <Search search={search} setSearch={setSearch} />
            {data.map((item, id) => (
                <div 
                key={id}
                onClick={() => selectedMake(item.name)}>
                <h3>{item.name}</h3>
                {/* <h3>{item.make} {item.model}</h3>
                <p>{item.year}</p> */}
                </div>
            ))}
        </div>
    );
}

export default Makes;
