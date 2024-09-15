"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import Button from '@/components/Button';
import { delete_user, get_stats } from '@/api/users';
import LoadingAnimation from '@/components/LoadingAnim';

function ProfileComponent() {
    const [username, setUsername] = useState("");
    const [stats, setStats] = useState<any>();
    const [delete_confirm, setDeleteConfirm] = useState(false); 
    const [delete_message, setDeleteMessage] = useState('Delete profile');

    if (!username) ensure_login().then(setUsername)


    if (!stats || stats.length === 0 && username) get_stats(username).then((stats) => setStats(stats));

    function deleteHandler() {
        if (!delete_confirm) {
            setDeleteMessage('Are you sure?');
            setDeleteConfirm(true);
            return;
        }
        delete_user(username).then(() => window.location.href = '/login');
    }

    return <div>
            <Header username={username} />
            <div>
                <div className='flex justify-center mt-4'> 
                    <p className='text-white text-2xl'>{username}</p>
                </div>
                <div>
                    <div className='m-4'>
                        <p className='text-white text-xl'>Stats:</p>
                        <p className='text-white font-ListComponent'>Total spots: {stats?.total_spots}</p>
                    </div>
                    <Button
                        onClick={deleteHandler}
                        text={delete_message}
                        className='text-xl mx-4'
                    />
                    <Button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        text='Logout'
                        className='text-xl'
                    />
                </div>
            </div>
        </div>
}

export default function Profile() {
    return <Suspense fallback={<LoadingAnimation text='Loading' />}>
        <ProfileComponent />
    </Suspense>
};
