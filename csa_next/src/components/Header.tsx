import React from "react";
import Search from "./Search";
import Link from "next/link";

type HeaderProps = {
    search?: string;
    setSearch?: (search: string) => void;
    username: string;
};

const Header = ({ search, setSearch, username }: HeaderProps) => {
    // return (
    //     <div className="flex justify-center items-center bg-gray-800 py-3 gap-8 lg:gap-20">
    //         <Link className="text-white p-2" href={`/makes?username=${username}`}>My spots</Link>
    //         {setSearch && <Search search={search as string} setSearch={setSearch} />}
    //         <Link className="text-white p-2" href="/makes">Upload spot</Link>
    //     </div>
    // );
    
    // return (
    //     <div className="bg-[#e73d2e] flex justify-center py-3 items-center gap-8 lg:gap-20 border-b-[6px] border-[#f39301]">
    //         <Link className="text-white p-2 text-xl italic font-medium" href={`/makes?username=${username}`}>My spots</Link>
    //         {setSearch && <Search search={search as string} setSearch={setSearch} />}
    //         <Link className="text-white p-2 text-xl italic font-medium" href="/makes">Upload spot</Link>
    //     </div>
    // );

    return (
        <div className=" bg-white border-b-[6px] border-white">
            <div className="flex justify-center py-3 items-center gap-8 lg:gap-20 border-b-[6px] border-black">
                <Link className="text-black p-2 text-xl italic font-medium" href={`/makes?username=${username}`}>My <span className="text-[#e72328]">spots</span></Link>
                {setSearch && <Search search={search as string} setSearch={setSearch} />}
                <Link className="text-black p-2 text-xl italic font-medium" href="/makes">Upload <span className="text-[#e72328]">spot</span></Link>
            </div>
        </div>
    );
};

export default Header;