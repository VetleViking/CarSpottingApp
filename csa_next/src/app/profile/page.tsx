import React from 'react';
import Header from '@/components/Header';
import { ensure_login } from '@/functions/server_functions';
import ProfileClient from './ProfileClient';
import { get_stats } from '@/api/serverside_users';

export default async function Profile() {
    const username = await ensure_login();
    const stats = await get_stats(username) as { 
        total_spots: number, 
        total_likes: number 
    };

    return (
        <div>
            <Header username={username} />
            <div>
                <div className='flex justify-center mt-4'>
                    <p className='text-white text-2xl'>{username}</p>
                </div>
                <div>
                    <div className='m-4'>
                        <p className='text-white text-xl'>Stats:</p>
                        <p className='text-white font-ListComponent'>Total spots: {stats?.total_spots}</p>
                        <p className='text-white font-ListComponent'>Total likes: {stats?.total_likes}</p>
                    </div>
                    <ProfileClient />
                </div>
            </div>
        </div>
    );
}