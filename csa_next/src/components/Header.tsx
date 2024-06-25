import React, { useState } from "react";
import Search from "./Search";

type HeaderProps = {
    search?: string;
    setSearch?: (search: string) => void;
    username: string;
};

const Header = ({ search, setSearch, username }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border-b-[6px] border-white">
            <div className="flex justify-between items-center gap-8 px-4 py-3 border-b-[6px] border-black md:justify-center md:gap-24">
                <button 
                    className="md:hidden text-xl" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    &#9776;
                </button>
                <div className="w-full flex gap-8 justify-between md:justify-center md:gap-24 items-center">
                    <button onClick={() => window.location.href = `/makes?username=${username}`} className="italic font-medium p-1 text-nowrap hidden md:block">My <span className="text-[#e72328]">spots</span></button>
                    {setSearch && <Search search={search as string} setSearch={setSearch} />}
                    <button onClick={() => window.location.href = `/makes`} className=" italic font-medium p-1 text-nowrap hidden md:block">Upload <span className="text-[#e72328]">spot</span></button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden flex flex-col gap-4 px-4 py-3">
                    <button onClick={() => window.location.href = `/makes?username=${username}`} className="italic font-medium p-1 text-nowrap w-max">My <span className="text-[#e72328]">spots</span></button>
                    <button onClick={() => window.location.href = `/makes`} className=" italic font-medium p-1 text-nowrap w-max">Upload <span className="text-[#e72328]">spot</span></button>
                </div>
            )}
        </div>
    );
};

export default Header;