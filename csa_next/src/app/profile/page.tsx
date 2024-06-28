"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';
import { delete_user, get_stats } from '@/api/users';

function ProfileComponent() {
    const [username, setUsername] = useState("");
    const [stats, setStats] = useState<{ total_spots: string; /* more here when implemented */ }[]>([]);   

    if (!username) {
        ensure_login().then((username) => setUsername(username));
    }

    if (!stats) {
        get_stats(username).then((stats) => setStats(stats));
    }

    function deleteHandler() {
        delete_user(username).then(() => window.location.href = '/login');
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
                        onClick={deleteHandler}
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
