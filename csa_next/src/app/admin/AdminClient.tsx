"use client";

import React from 'react';
import Button from '@/components/Button';
import { update_spots } from '@/api/cars';
import { update_users } from '@/api/users';
import ReleaseNotes from '@/components/ReleaseNotes';
import AddAdmin from '@/components/AddAdmin';

export default function AdminClientSide({ currentVersion }: { currentVersion: string }) {
    return (
        <div>
            <Button
                onClick={update_spots}
                text='Update spots'
                className='text-xl m-4'
            />
            <Button
                onClick={update_users}
                text='Update users'
                className='text-xl m-4'
            />
            <div className='flex flex-col items-center gap-8 m-8'>
                <AddAdmin />
                <ReleaseNotes currentVersion={currentVersion} />
            </div>
        </div>
    );
}
