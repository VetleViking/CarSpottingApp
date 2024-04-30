"use client";

import React, { useState, useEffect } from 'react';
import { get_models } from '@/api/api';
import { useSearchParams } from "next/navigation";


function Makes() {
    //const [data, setData] = useState<{ name: string; }[]>([]);
    const searchParams = useSearchParams();
    const make = searchParams.get('make');
    const model = searchParams.get('model');

    useEffect(() => {
        const fetchData = async () => {
            // add loading of spots here
            console.log(make);
            console.log(model);
        };

        fetchData();
    }, []);

    // if (!data) {
    //     return (
    //         <div className="text-white">Loading...</div>
    //     );
    // }

    return (
        <div>
            <h1 className="text-white text-center">Selected Make: {make}</h1>
            <h2 className="text-white text-center">Selected Model: {model}</h2>
        </div>
    );
}

export default Makes;
