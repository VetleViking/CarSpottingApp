import { create_user, login } from "@/api/api";
import { useState } from "react";

const Login = () => {   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login_handler = async (username: string, password: string) => {
        login(username, password);
    }

    return (
        <div className="flex flex-col gap-2 w-48 p-2">
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

            <button className="rounded-lg bg-gray-700 p-1 m-2 border-2 border-gray-800 text-white" onClick={() => {login_handler(username, password)}}>Log in</button>
        </div>
    );
};

export default Login;