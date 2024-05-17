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
        <div className="flex justify-center items-center bg-gray-800 py-3 gap-12">
            <Link className="text-white p-2" href={`/makes?username=${username}`}>My spots</Link>
            {setSearch && <Search search={search as string} setSearch={setSearch} />}
            <Link className="text-white p-2" href="/makes">Upload spot</Link>
        </div>
    );
};

export default Header;