"use client";

import { create_user, get_makes, get_spotted_makes, upload_makes, upload_spot } from "@/api/api";
import CreateUser from "@/components/CreateUser";
import ListComponent from "@/components/ListComponent";
import Login from "@/components/Login";
import Search from "@/components/Search";
import UploadSpot from "@/components/UploadSpot";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function MySpots() {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ name: string; }[]>([]);

    function selectedMake(make: string) {
        window.location.href = `/myspots/selected?make=${make}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_spotted_makes(search);
            
            setData(data);
        };

        fetchData();
    }, [search]);

    if (!data) {
        return (
            <div className="text-white">Loading...</div>
        );
    }

    return (
        <div>
            <UploadSpot 
            make={"Bugatti"}
            model={"chiron"}
            />
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
            {data.map((item: any, id) => (
                <div
                key={id}
                onClick={() => selectedMake(item)}>
                    <ListComponent  title={item} />
                </div>
            ))}
        
        </div>
        
  );
}
