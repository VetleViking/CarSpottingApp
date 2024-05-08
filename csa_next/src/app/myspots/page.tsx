"use client";

import { create_user, get_makes, upload_makes } from "@/api/api";
import CreateUser from "@/components/CreateUser";
import ListComponent from "@/components/ListComponent";
import Login from "@/components/Login";
import Search from "@/components/Search";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function MySpots() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);
    const [file, setFile] = useState<FileList | null>(null);

    function selectedMake(make: string) {
        window.location.href = `/makes/selected?make=${make}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_makes(search);
            
            setData(data);
        };

        fetchData();
    }, [search]);

    useEffect(() => {
        if (!file) {
            return;
        }

        const upload = async () => {
            const formData = new FormData();
            formData.append('file', file[0]);

            console.log(formData);
        };

        upload();
    }, [file]);

    if (!data) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={
                (e) => {
                    setFile(e.target.files);
                }}/>
            <CreateUser />
            <Login />
            <button onClick={upload_makes}>Upload makes</button>

            <p className='text-center text-white text-xl mb-4'>Select the make</p>
            <Search search={search} setSearch={setSearch} />
            <div className="text-white text-center">My Spots</div>
            <Link href="/" className="text-white">
                Back
            </Link>
            <div onClick={() => selectedMake("unknown")}>
                <ListComponent title="Dont know / other" />
            </div>
            {data.map((item, id) => (
                <div
                key={id}
                onClick={() => selectedMake(item.name)}>
                    <ListComponent  title={item.name} />
                </div>
            ))}
        
        </div>
        
  );
}
