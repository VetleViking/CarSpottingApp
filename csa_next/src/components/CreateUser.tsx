"use client";
import { create_user, login } from "@/api/users";
import { useState } from "react";

const CreateUser = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const create_user_handler = async (username: string, password: string) => {
        const data = await create_user(username, password);
        
        if (data.message === "User created") {
            const loginData = await login(username, password);

            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
                window.location.href = '/';
            } else setErrormessage(loginData.message);
        } else setErrormessage(data.message);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && username && password) {
            create_user_handler(username, password);
        }
    });
    
    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <input 
            className="font-ListComponent"
            type="text" 
            placeholder="username" 
            value={username}
            onChange={e => setUsername(e.target.value)}/>

        <input 
            className="font-ListComponent"
            type="password" 
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
            
        <button 
            className="bg-white text-black py-1 px-2 mt-1 italic" 
            onClick={() => create_user_handler(username, password)}>Create user</button>
        <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
    </div>
};

export default CreateUser;