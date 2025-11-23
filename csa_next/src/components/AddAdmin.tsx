import { add_admin } from "@/api/users";
import React, { useState } from "react";

const AddAdmin = () => {
    const [adminUsername, setAdminUsername] = useState("");
    const [errormessage, setErrormessage] = useState("");
    const [message, setMessage] = useState("");

    const addAdminHandler = async () => {
        setErrormessage("");
        setMessage("");

        if (adminUsername.trim() === "") {
            setErrormessage("Username cannot be empty");
            return;
        }

        try {
            const res = await add_admin(adminUsername);
            if (res.status === 200) {
                setAdminUsername("");
                setMessage("Admin user added successfully");
                setErrormessage("");
            } else {
                const data = await res.json();
                setErrormessage(data.message || "Failed to add admin");
            }
        } catch (error) {
            setErrormessage("An error occurred");
        }
    };

    return (
        <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
            <p className="text-center text-xl text-white">Add admin user</p>
            <input
                type="text"
                placeholder="Admin username"
                value={adminUsername}
                onChange={(e) => {
                    setErrormessage("");
                    setMessage("");
                    setAdminUsername(e.target.value);
                }}
                onKeyDown={(e) => {
                    e.key === "Enter" && addAdminHandler();
                }}
                className="font-ListComponent"
            />
            <button
                className="bg-white text-black py-1 px-2 mt-1 italic"
                onClick={() => addAdminHandler()}
            >
                Add admin
            </button>
            {errormessage && (
                <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>
            )}
            {message && <p className="text-white text-center font-ListComponent">{message}</p>}
        </div>
    );
};

export default AddAdmin;
