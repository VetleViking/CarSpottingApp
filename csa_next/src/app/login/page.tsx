import LoginComponent from "@/components/LoginComponent";
import CreateUser from "@/components/CreateUser";
import React from 'react';

export default function Login() {
    return (
        <div className='flex justify-around flex-wrap gap-12 mt-8 px-8'>|
            <LoginComponent />
            <CreateUser />
        </div>
    );
};
