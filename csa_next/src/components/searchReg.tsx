import React, { useState } from "react";
import Button from "./Button";
import Image from "next/image";
import down_arrow from "@/images/down_arrow.svg";
import { regnr_info } from "@/api/cars";
import LoadingAnimation from "./LoadingAnim";


const SearchReg = () => {
    const [reg, setReg] = useState("");
    const [regResult, setRegResult] = useState<{ make: string; model: string; }>({ make: "", model: "" });
    const [regError, setRegError] = useState("");
    const [regOpen, setRegOpen] = useState(false);
    const [loading, setLoading] = useState(false);

     function searchRegHandler(reg: string) {
        if (!reg) return;

        setLoading(true);
        setRegError("");
        setRegResult({ make: "", model: "" });

        regnr_info(reg).then((data: {make?: string, model?: string, error?: string}) => {
            if (data.make && data.model) {
                setRegResult({make: data.make, model: data.model});
            } else {
                setRegError(data.error || "No results found");
            } 
            setLoading(false);
        });
    }

    return <div className="w-full">
        <div className="flex justify-between rounded-sm p-1 border border-[#9ca3af]" onClick={() => setRegOpen(!regOpen)}>
            <p className=" font-ListComponent text-[#9ca3af]">Search by reg</p>
            <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={regOpen ? "transform rotate-180" : ""}/>
        </div>
        {regOpen && <div className='absolute bg-black border border-[#9ca3af] p-2'>
            <div className="flex items-center justify-center gap-4">
                <input
                    className='font-ListComponent border border-black p-2 w-full h-full rounded-md'
                    type='text'
                    placeholder='NO (AB12345)'
                    value={reg}
                    onChange={(e) => setReg(e.target.value)}
                />
                <Button onClick={() => searchRegHandler(reg)} 
                    text="Search by reg"/>
            </div>
            <div>
                {loading && <LoadingAnimation text="Loading"/>}
                {regResult.make && <div> 
                    <p className=" font-ListComponent text-[#9ca3af]">Results:</p>
                    <p className="font-ListComponent text-[#9ca3af]">make: {regResult.make} </p>
                    <p className="font-ListComponent text-[#9ca3af]">model: {regResult.model}</p>
                </div>}
                {regError && <p className="font-ListComponent text-[#9ca3af]">Error: {regError}</p>}
            </div>
        </div>}
    </div>
};

export default SearchReg;