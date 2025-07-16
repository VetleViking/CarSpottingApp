import React, { useState } from "react";

const AddAdmin  = () => {
    const [adminUsername, setAdminUsername] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const addAdminHandler = async () => {
        console.log(`Adding admin user: ${adminUsername}`);
    }

    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <p className="text-center text-xl text-white">Add admin user</p>
        <input
            type="text"
            placeholder="Admin username"
            value={adminUsername}
            onChange={e => setAdminUsername(e.target.value)} 
            onKeyDown={(e) => {
                if(e.key === 'Enter') addAdminHandler();
            }}  
            className="font-ListComponent"
        />
        <button
            className="bg-white text-black py-1 px-2 mt-1 italic"
            onClick={() => addAdminHandler()}>Create user</button>
        {errormessage && <p className="text-[#e72328] text-center font-ListComponent">{errormessage}</p>}
    </div>
};

export default AddAdmin;