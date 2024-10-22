import React from 'react';
import Header from '@/components/Header';
import DiscoverClient from './DiscoverClient';
import { ensure_login_new } from '@/functions/server_functions';

export default async function Discover() {
    const username = await ensure_login_new();

    return <div>
        <Header username={username} />
        <DiscoverClient />
    </div >
}