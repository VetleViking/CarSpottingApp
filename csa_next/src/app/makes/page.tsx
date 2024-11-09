import React from 'react';
import AskAi from '@/components/AskAi';
import MakesClient from './MakesClient';
import { ensure_login } from '@/functions/server_functions';

export default async function MakesComponent({searchParams}: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const resolvedSearchParams = await searchParams;
    const username = resolvedSearchParams.username as string || undefined; 
    const altUsername = await ensure_login();

    return <div>
        <AskAi />
        <MakesClient username={username} altUsername={altUsername} />
    </div>
}
