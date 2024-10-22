"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'
import { ensure_login } from '@/functions/functions';
import AskAi from '@/components/AskAi';
import LoadingAnimation from '@/components/LoadingAnim';
import MakesClient from './MakesClient';
import { ensure_login_new } from '@/functions/server_functions';

export default async function MakesComponent() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username') || undefined; 

    const altUsername = await ensure_login_new();


    

    return <div>
        <AskAi />
        <MakesClient username={username} altUsername={altUsername} />
    </div>
}
