import React from "react";
import Search from "./Search";
import Link from "next/link";

type HeaderProps = {
    search?: string;
    setSearch?: (search: string) => void;
    username: string;
};

const Header = ({ search, setSearch, username }: HeaderProps) => {
    return (
        <div className=" bg-white border-b-[6px] border-white">
            <div className="flex gap-8 justify-between md:justify-center md:gap-24 px-4 py-3 items-center border-b-[6px] border-black">
                <button onClick={() => window.location.href = `/makes?username=${username}`} className="italic font-medium p-1 text-nowrap">My <span className="text-[#e72328]">spots</span></button>
                {setSearch && <Search search={search as string} setSearch={setSearch} />}
                <button onClick={() => window.location.href = `/makes`} className=" italic font-medium p-1 text-nowrap">Upload <span className="text-[#e72328]">spot</span></button>
            </div>
        </div>
    );
};

export default Header;