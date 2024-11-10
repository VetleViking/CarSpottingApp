"use client";

import { get_models, get_spotted_models } from "@/api/cars";
import Header from "@/components/Header";
import ListComponent from "@/components/ListComponent";
import Search from "@/components/Search";
import { ReactNode, useEffect, useState } from "react";

interface MakeSelectedClientProps {
    altUsername: string;
    username?: string;
    make: string;
    children?: ReactNode;
};

const MakeSelectedClient = ({altUsername, username, make, children}: MakeSelectedClientProps) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<{ model: string; }[]>([]);

    function selectedModel(make: string, model: string) {
        username ? window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}&username=${username}`
                 : window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}`
    }

    useEffect(() => {
        const fetchData = () => {
            username ? get_spotted_models(make as string, search, username).then(data => setData(data.sort((a: any, b: any) => a.model.localeCompare(b.model)))) 
                     : get_models(make as string, search).then(data => setData(data.sort((a: any, b: any) => a.model.localeCompare(b.model))));
        };

        fetchData();
    }, [search, make, username]);

    return <div>
        <Header username={altUsername as string} />
        <Search search={search} setSearch={setSearch} />
        {children}
        {(Array.isArray(data) && data.length > 0)
            ? data.map((item: any, id) => <div key={id} onClick={() => { selectedModel(item.make, item.model) }}>
                <ListComponent title={make == "unknown" ? item.make + " " + item.model : item.model} />
            </div>)
            : <div className="text-white font-ListComponent px-1 text-nowrap text-center">No models found</div>}
    </div>
};

export default MakeSelectedClient;