"use client";

import React from 'react';
import Button from '@/components/Button';
import { update_spots } from '@/api/cars';
import { update_users } from '@/api/users';
import ReleaseNotes from '@/components/ReleaseNotes';

export default function AdminClientSide() {
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
            <ReleaseNotes />
        </div>
    );
}
