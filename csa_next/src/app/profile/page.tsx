"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';

function ProfileComponent() {
    const [username, setUsername] = useState("");

    if (!username) {
        ensure_login().then((username) => setUsername(username));
    }

    return (
        <div>
            <Header username={username} />
            
        </div>
    );
}

export default function Profile() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileComponent />
        </Suspense>
    );
};
