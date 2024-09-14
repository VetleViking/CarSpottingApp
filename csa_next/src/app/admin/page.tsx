"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';
import { check_admin } from '@/api/users';
import { update_spots } from '@/api/cars';
import LoadingAnimation from '@/components/LoadingAnim';

function AdminComponent() {
    const [username, setUsername] = useState("");

    if (!username) ensure_login().then(setUsername);

    if (username) check_admin(username).then(res => {if (!res.is_admin) window.location.href = '/'});

    return <div>
        <Header username={username} />
        <Button
            onClick={update_spots}
            text='Update spots'
            className='text-xl m-4'
        />
    </div>
}

export default function Admin() {
    return <Suspense fallback={<LoadingAnimation text='Loading'/>}>
        <AdminComponent />
    </Suspense>
};
