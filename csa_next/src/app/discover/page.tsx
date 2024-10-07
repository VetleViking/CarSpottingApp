"use client";

import React, { Suspense, useState } from 'react';
import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import LoadingAnimation from '@/components/LoadingAnim';

function ProfileComponent() {
    const [username, setUsername] = useState("");
    const [spots, setSpots] = useState<{
        name: string;
        urlArr: string[];
        tags: string[];
        notes: string;
        date: string;
        key: string;
    }[]>([]);

    if (!username) ensure_login().then(setUsername);

    if (!spots)

        return <div>
            <Header username={username} />
            <div>

            </div>
        </div>
}

export default function Profile() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <ProfileComponent />
    </Suspense>
};
