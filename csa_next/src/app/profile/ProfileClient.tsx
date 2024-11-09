"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { delete_user } from '@/api/users';

export default function ProfileClient() {
    const [delete_confirm, setDeleteConfirm] = useState(false);
    const [delete_message, setDeleteMessage] = useState('Delete profile');


    function deleteHandler() {
        if (!delete_confirm) {
            setDeleteMessage('Are you sure?');
            setDeleteConfirm(true);
            return;
        }
        delete_user().then(() => window.location.href = '/login');
    }

    return <div>
        <Button
            onClick={deleteHandler}
            text={delete_message}
            className='text-xl mx-4'
        />
        <Button
            onClick={() => {
                localStorage.removeItem('token'); // TODO: replace with cookies.remove('token') or something
                window.location.href = '/login';
            }}
            text='Logout'
            className='text-xl'
        />
    </div>
}

