
import React from 'react';
import Header from '@/components/Header';
import AdminClientSide from './AdminClient';
import { ensure_login_new } from '@/functions/server_functions';
import { check_admin_new } from '@/api/serverside_users';
import { redirect } from 'next/navigation';

export default async function Admin() {
    const username = await ensure_login_new();
    const isAdmin = await check_admin_new().then(res => !!res.is_admin);

    if (!isAdmin) redirect('/login');

    return <div>
        <Header username={username} />
        <AdminClientSide />
    </div>
}