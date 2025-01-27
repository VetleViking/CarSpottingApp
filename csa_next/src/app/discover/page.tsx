import React from 'react';
import Header from '@/components/Header';
import DiscoverClient from './DiscoverClient';
import { ensure_login } from '@/functions/server_functions';
import { check_admin } from '@/api/serverside_users';

export default async function Discover() {
    const username = await ensure_login();
    const isAdmin = await check_admin().then(res => !!res.is_admin);

    return <div>
        <Header username={username} />
        <DiscoverClient username={username} isAdmin={isAdmin} />
    </div >
}