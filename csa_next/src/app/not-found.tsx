import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import Link from 'next/link';
import React from 'react';

export default async function NotFound() {
    const username = await ensure_login();

    return ( 
        <div>
            <Header username={username} />
            <p className="text-white text-4xl text-center mt-8">
                404 Not found
            </p>
            <div className='flex justify-center mt-8'>
                <Link href="/" className="bg-[#e72328] text-white p-2 border border-black italic text-nowrap">
                    Go to home page
                </Link>
            </div>
        </div>
    );
}