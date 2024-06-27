"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';

function ProfileComponent() {
    const [username, setUsername] = useState("");
    const [stats, setStats] = useState<{ total_spots: string; /* more here when implemented */ }[]>([]);   

    if (!username) {
        ensure_login().then((username) => setUsername(username));
    }

    return (
        <div>
            <Header username={username} />
            <div>
                <div className='flex justify-center mt-4'> 
                    <p className='text-white text-2xl'>{username}</p>
                </div>
                <div>
                    <div>
                        <p className='text-white text-xl'>Stats:</p>
                    </div>
                    <Button
                        onClick={() => {}}
                        text='Delete profile'
                        className='text-xl'
                    />
                </div>
            </div>
        </div>
    );
}

// [#9ca3af]

export default function Profile() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileComponent />
        </Suspense>
    );
};
