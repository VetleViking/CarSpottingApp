"use client";

import { create_user, login } from "@/api/users";
import { useState } from "react";

const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const create_user_handler = async () => {
        try {
            const data = await create_user(username, password);

            if (data.message === "User created") {
                const loginData = await login(username, password);

                loginData.message === "Logged in"
                    ? (window.location.href = "/")
                    : setErrormessage(loginData.message || "An error occurred");
            } else setErrormessage(data.message || "An error occurred");
        } catch (err) {
            setErrormessage("An error occurred");
        }
    };

    return (
        <div>
            <p className="text-white text-center p-2 text-xl italic font-medium">
                Sign <span className="text-[#e72328]">up</span>
            </p>
            <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
                <input
                    className="font-ListComponent"
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") create_user_handler();
                    }}
                />
                <input
                    className="font-ListComponent"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") create_user_handler();
                    }}
                />
                <button
                    className="bg-white text-black py-1 px-2 mt-1 italic"
                    onClick={() => create_user_handler()}
                >
                    Create user
                </button>
                <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
            </div>
        </div>
    );
};

export default CreateUser;
