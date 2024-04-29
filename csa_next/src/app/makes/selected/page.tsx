"use client";

import { useEffect, useState } from "react";

export default function MakeSelected() {
    const [make, setMake] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const queryParams = new URLSearchParams(window.location.search);
            setMake(queryParams.get('make') || '');
        }
    }, []);

    console.log(make);

    return (
        <div>
            <h1>Selected Make: {make}</h1>
            {/* Rest of your component UI */}
        </div>
    );
};