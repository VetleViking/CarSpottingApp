import Header from '@/components/Header';
import { ensure_login } from '@/functions/functions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function NotFound() {
    const username = await ensure_login();

    return ( 
        <div>
            <Header username={username} />
            <Image
                src="https://http.cat/images/404.jpg"
                alt="404 Not Found"
                width={500}
                height={500}
                className="mx-auto mt-8"
            />
            <div className='flex justify-center mt-8'>
                <Link href="/" className="bg-[#e72328] text-white p-2 border border-black italic text-nowrap">
                    Go to home page
                </Link>
            </div>
        </div>
    );
}