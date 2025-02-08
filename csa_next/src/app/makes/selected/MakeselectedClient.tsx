"use client";

import { get_models, get_spotted_models } from "@/api/cars";
import ListComponent from "@/components/ListComponent";
import { ReactNode, useEffect, useState } from "react";
import SearchReg from "@/components/SearchReg";
import AddNew from "@/components/AddNew";
import Header from "@/components/Header";
import Search from "@/components/Search";
import LoadingAnimation from "@/components/LoadingAnim";

interface MakeSelectedClientProps {
    altUsername: string;
    username?: string;
    make: string;
    children?: ReactNode;
};

interface Model {
    make: string;
    model: string;
}
  

const MakeSelectedClient = ({altUsername, username, make, children}: MakeSelectedClientProps) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);

    function selectedModel(make: string, model: string) {
        const url = `/makes/selected/modelselected?make=${make}&model=${model}`;
        window.location.href = username ? `${url}&username=${username}` : url;
    }

    useEffect(() => {
        const fetchData = async () => {
            const fetchFn = username ? get_spotted_models : get_models;
            const models = await fetchFn(make as string, search, username);
        
            setData(
                models.sort((a: Model, b: Model) => a.model.localeCompare(b.model))
            );
            setLoading(false);
        };
      
        fetchData();
    }, [search, make, username]);

    return (
        <div>
            <Header username={altUsername as string} />
            {children}
            <Search search={search} setSearch={setSearch} />
            {!username && (
                <div className='flex gap-2 mx-1 mb-4 flex-wrap md:flex-nowrap'>
                    <AddNew type='model' make={make} />
                    <SearchReg />
                </div>
            )}
            {Array.isArray(data) && data.length > 0 ? (
                data.map((item: any, id) => 
                    <div key={id} onClick={() => { selectedModel(item.make, item.model) }}>
                        <ListComponent title={make == "unknown" ? item.make + " " + item.model : item.model} />
                    </div>
                )
            ) : loading ? (
                <LoadingAnimation text="Loading" />
            ) : (
                <div className="text-white font-ListComponent px-1 text-nowrap text-center">
                    No models found
                </div>
            )}
        </div>
    );
};

export default MakeSelectedClient;