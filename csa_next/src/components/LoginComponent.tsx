"use client";

import { login } from "@/api/users";
import { useState } from "react";

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const login_handler = async (username: string, password: string) => {
        const data = await login(username, password);

        data.message === 'Logged in' ? window.location.href = '/' : setErrormessage(data.message || 'An error occurred');
    }

    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <input
            className="font-ListComponent"
            type="text"
            placeholder="username"
            value={username}
            onChange={e => setUsername(e.target.value)} 
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    login_handler(username, password);
                }
            }}    
        />
        <input
            className="font-ListComponent"
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    login_handler(username, password);
                }
            }}     
        />
        <button
            className="bg-white text-black py-1 px-2 mt-1 italic"
            onClick={() => login_handler(username, password)}>Log in</button>
        <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
    </div>
};

export default LoginComponent;