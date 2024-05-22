"use client";
import { create_user } from "@/api/api";
import { useState } from "react";

const CreateUser = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrormessage] = useState('');

    const create_user_handler = async (username: string, password: string) => {
        const data = await create_user(username, password);
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } else {
            setErrormessage(data.message);
        }
    }


    
    return (
        // <div className="flex flex-col gap-2 w-48 p-2 bg-gray-600 rounded-md">
        //     <input 
        //         type="text" 
        //         placeholder="username" 
        //         value={username}
        //         onChange={(e) => {
        //             setUsername(e.target.value);
        //         }}/>

        //     <input 
        //         type="text" 
        //         placeholder="password"
        //         value={password}
        //         onChange={(e) => {
        //             setPassword(e.target.value);
        //         }} />
                
        //     <button className="rounded-lg bg-gray-700 p-1 m-2 border-2 border-gray-800 text-white" onClick={() => {create_user_handler(username, password)}}>Create user</button>
        //     <p className="text-red-500 text-center">{errormessage}</p>
        // </div>
    
        <div className="flex flex-col gap-2 w-48 p-2 bg-gray-600 rounded-md">
            <input 
                type="text" 
                placeholder="username" 
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                }}/>

            <input 
                type="text" 
                placeholder="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }} />
                
            <button className="rounded-lg bg-gray-700 p-1 m-2 border-2 border-gray-800 text-white" onClick={() => {create_user_handler(username, password)}}>Create user</button>
            <p className="text-red-500 text-center">{errormessage}</p>
        </div>
    );
};

export default CreateUser;