import React, { useState } from "react";

const AddAdmin  = () => {
    const [adminUsername, setAdminUsername] = useState("");

    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <p className="text-center text-xl text-white">Add admin user</p>
        <input
            type="text"
            value={adminUsername}
            onChange={e => setAdminUsername(e.target.value)} 
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    console.log(`Adding admin user: ${adminUsername}`);
                }
            }}  
            className="font-ListComponent"
        />
    </div>
};

export default AddAdmin;