"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';
import { check_admin } from '@/api/users';
import { regnr_info, update_spots } from '@/api/cars';
import LoadingAnimation from '@/components/LoadingAnim';

function AdminComponent() {
    const [username, setUsername] = useState("");
    const [regnr, setRegnr] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    if (!username) ensure_login().then(setUsername);

    if (username && !isAdmin) check_admin(username).then(res => { !res.is_admin ? window.location.href = '/' : setIsAdmin(true) });

    return <div>
        <Header username={username} />
        <Button
            onClick={update_spots}
            text='Update spots'
            className='text-xl m-4'
        />
        <div className='flex flex-col w-min'>
            <input type="text" placeholder='regnr' value={regnr} onChange={e => setRegnr(e.target.value)} />
            <Button
                onClick={() => regnr_info(regnr)}
                text='Get regnr info'
                className='text-xl m-4'
            />
        </div>
    </div>
}

export default function Admin() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <AdminComponent />
    </Suspense>
};
