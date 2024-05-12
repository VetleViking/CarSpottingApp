"use client";
import React from 'react';

import CreateUser from "@/components/CreateUser";
import LoginComponent from "@/components/LoginComponent";

export default function Login() {
    return (
        <div className='flex justify-around flex-wrap mt-4'>
            <div>
                <p className='text-white text-xl text-center'>Log in</p>
                <LoginComponent />
            </div>
            <div>
                <p className='text-white text-xl text-center'>Sign up</p>
                <CreateUser />
            </div>
        </div>
    );
}