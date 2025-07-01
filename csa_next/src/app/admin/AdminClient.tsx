"use client";

import React from 'react';
import Button from '@/components/Button';
import { update_spots } from '@/api/cars';
import { update_users } from '@/api/users';

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
            <div>
                <p className='text-white text-center p-2 text-xl italic font-medium'>
                    Create Release Notes
                </p>
                <p>implement later</p>
            </div>
        </div>
    );
}
