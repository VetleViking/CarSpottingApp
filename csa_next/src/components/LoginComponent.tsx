"use client";

import { login } from "@/api/users";
import { useState } from "react";

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const login_handler = async () => {
        try {
            const data = await login(username, password);

            data.message === 'Logged in' ? window.location.href = '/' : setErrormessage(data.message || 'An error occurred');
        } catch (err) {
            setErrormessage('An error occurred')
        }
    }

    return <div>
        <p className="text-white text-center p-2 text-xl italic font-medium">Sign <span className="text-[#e72328]">in</span></p>
        <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
            <input
                className="font-ListComponent"
                type="text"
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)} 
                onKeyDown={(e) => {
                    if(e.key === 'Enter') login_handler();
                }}    
            />
            <input
                className="font-ListComponent"
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter') login_handler();
                }}     
            />
            <button
                className="bg-white text-black py-1 px-2 mt-1 italic"
                onClick={() => login_handler()}
            >
                Log in
            </button>
            <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
        </div>
    </div>
};

export default LoginComponent;