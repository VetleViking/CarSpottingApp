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
            <div className="flex justify-center py-3 items-center gap-8 lg:gap-20 border-b-[6px] border-black">
                <button onClick={() => window.location.href = `/makes?username=${username}`} className="italic font-medium">My <span className="text-[#e72328]">spots</span></button>
                {setSearch && <Search search={search as string} setSearch={setSearch} />}
                <button onClick={() => window.location.href = `/makes`} className=" italic font-medium">Upload <span className="text-[#e72328]">spot</span></button>
            </div>
        </div>
    );
};

export default Header;