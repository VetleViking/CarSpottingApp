"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import search_icon from "@/images/search_icon.svg";

type SearchSpotProps = {
    search: string;
    setSearch: (search: string) => void;
    enter?: () => void;
};

const SearchSpots = ({ search, setSearch, enter }: SearchSpotProps) => {
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleEnter(event: KeyboardEvent) {
            if (event.key === "Enter" && searchRef.current) {
                searchRef.current.blur();
                if (enter) enter();
            }
        }

        document.addEventListener("keydown", handleEnter);
        return () => document.removeEventListener("keydown", handleEnter);
    }, [searchRef]);

    return (
        <div ref={searchRef} className="flex justify-center">
            <input
                className={`w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent`}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <Image 
                src={search_icon} 
                alt="Search icon" 
                width={15} 
                height={15}
                onClick={() => enter ? enter() : null}    
            />
        </div>
    );
};

export default SearchSpots;