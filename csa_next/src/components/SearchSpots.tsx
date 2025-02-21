"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import search_icon from "@/images/search_icon.svg";
import crossmark from "@/images/crossmark.svg";
import { search_autocomplete } from "@/api/cars";

type SearchSpotProps = {
    onSearch: (search: string) => void;
    search: string;
    setSearch: (search: string) => void;
};

const SearchSpots = ({ onSearch, search, setSearch }: SearchSpotProps) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        searchRef.current?.blur();
        onSearch(search);
    }

    async function handleSearchAutocomplete(query: string) {
        const suggestions = await search_autocomplete(query);
        setSearchSuggestions(suggestions);
    }

    return (
        <div className="flex justify-center mb-4">
            <div className="relative w-full">
                <form
                    onSubmit={handleSubmit} 
                    className="flex items-center justify-center  rounded-lg w-full"
                >
                    <input
                        ref={searchRef}
                        className={`w-full mr-1 p-1 rounded-lg border border-black font-ListComponent`}
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => {
                            e.target.value 
                                ? handleSearchAutocomplete(e.target.value) 
                                : setSearchSuggestions([]);
                            setSearch(e.target.value) 
                        }}
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
                </form>
                {searchSuggestions.length > 0 && (
                    <ul className="absolute bg-white border border-black rounded-lg mt-1 w-full max-h-60 overflow-auto">
                        {searchSuggestions.map((suggestion, id) => (
                            <li
                                key={id}
                                className="p-1 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                setSearch(suggestion);
                                onSearch(suggestion);
                                setSearchSuggestions([]);
                                }}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchSpots;