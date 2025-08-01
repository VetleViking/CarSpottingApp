
import React from 'react';
import Header from '@/components/Header';
import AdminClientSide from './AdminClient';
import { ensure_login } from '@/functions/server_functions';
import { check_admin, get_current_version } from '@/api/serverside_users';
import { redirect } from 'next/navigation';

export default async function Admin() {
    const username = await ensure_login();
    const isAdmin = await check_admin().then(res => !!res.is_admin);
    const currentVersion = await get_current_version();

    if (!isAdmin) redirect('/login');

    return (
        <div>
            <Header username={username} />
            <AdminClientSide currentVersion={currentVersion} />
        </div>
    );
}
