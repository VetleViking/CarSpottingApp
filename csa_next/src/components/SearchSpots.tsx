"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import search_icon from "@/images/search_icon.svg";
import crossmark from "@/images/crossmark.svg";

type SearchSpotProps = {
    onSearch: (search: string) => void;
};

const SearchSpots = ({ onSearch }: SearchSpotProps) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");

    return (
        <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center  rounded-lg w-full">
                <input
                    ref={searchRef}
                    className={`w-full max-w-2xl mr-1 p-1 rounded-lg border border-black font-ListComponent`}
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && searchRef.current) {
                            searchRef.current.blur();
                            onSearch(search);
                        }
                    }}
                    // onSubmit={() => onSearch(search)} // If enter does not work on mobile, debug later
                />
                <Image 
                    src={search_icon} 
                    alt="Search icon" 
                    width={25} 
                    height={25}
                    onClick={() => onSearch(search)}
                    className="cursor-pointer pr-1"
                />
                {search.length > 0 && (
                    <Image 
                        src={crossmark} 
                        alt="Clear search" 
                        width={25} 
                        height={25}
                        onClick={() => {
                            setSearch("");
                            onSearch("");
                        }}
                        className="cursor-pointer pl-1"
                    />
                )}
            </div>
        </div>
    );
};

export default SearchSpots;