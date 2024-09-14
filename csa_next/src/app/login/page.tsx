"use client";

import React from 'react';
import CreateUser from "@/components/CreateUser";
import LoginComponent from "@/components/LoginComponent";

export default function Login() {
    return <div className='flex justify-around flex-wrap gap-12 mt-8 px-8'>
        <div>
            <p className="text-white text-center p-2 text-xl italic font-medium">Sign <span className="text-[#e72328]">in</span></p>
            <LoginComponent />
        </div>
        <div>
            <p className="text-white text-center p-2 text-xl italic font-medium">Sign <span className="text-[#e72328]">up</span></p>
            <CreateUser />
        </div>
    </div>
}