"use client";

import { get_makes, get_spotted_makes } from "@/api/cars";
import AddNew from "@/components/AddNew";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import SearchReg from "@/components/SearchReg";
import { useEffect, useState } from "react";

interface MakesClientProps {
    altUsername: string;
    username?: string;

};

const MakesClient = ({altUsername, username}: MakesClientProps) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);

    function selectedMake(make: string) {
        username
            ? window.location.href = `/makes/selected?make=${make}&username=${username}`
            : window.location.href = `/makes/selected?make=${make}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            if (username) {
                const data = await get_spotted_makes(search, username);
                data.sort((a: string, b: string) => a.localeCompare(b));
                setData(data);
            } else {
                const data = await get_makes(search);
                data.sort((a: string, b: string) => a.localeCompare(b));
                setData(data);
            }
        };

        fetchData();
    }, [search, username]);

    return <div>
        <Header search={search} setSearch={setSearch} username={altUsername} />
        <p className='text-center text-white text-3xl my-4'>Select the make</p>
        <div className='flex gap-2 mx-1 mb-4 flex-wrap md:flex-nowrap'>
            <div onClick={() => selectedMake("unknown")} className="bg-black border border-[#9ca3af] cursor-pointer w-full">
                <p className="text-[#9ca3af] font-ListComponent px-1 py-2 text-nowrap">Dont know</p>
            </div>
            {!username && <AddNew type='make' />}
            {!username && <SearchReg />}
        </div>
        {Array.isArray(data) && data.length > 0 ? data.map((item: any, id) => <div
            key={id}
            onClick={() => selectedMake(item)}>
            <ListComponent title={item} />
        </div>) : <p className='text-white font-ListComponent px-1 text-nowrap text-center'>No makes found.</p>}
    </div>
};

export default MakesClient;