"use client";

import React from 'react';
import Button from '@/components/Button';
import { update_spots } from '@/api/cars';

export default function AdminClientSide() {
    return <>
        <Button
            onClick={update_spots}
            text='Update spots'
            className='text-xl m-4'
        />
        <div>
            <p className='text-white text-center p-2 text-xl italic font-medium'>Create Release Notes</p>
            <p>implement later</p>
        </div>
    </>
}