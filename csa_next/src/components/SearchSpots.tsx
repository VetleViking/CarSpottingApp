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
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
    const [tempSearch, setTempSearch] = useState<boolean>(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSearch(search);
        searchRef.current?.blur();
        setSearchSuggestions([]);
    }

    async function handleSearchAutocomplete(query: string) {
        const suggestions = await search_autocomplete(query);
        setSearchSuggestions(suggestions);
        setActiveSuggestionIndex(-1);
    }

    function selectSuggestion(selected: string) {
        setSearch(selected);
        onSearch(selected);
        searchRef.current?.blur();
        setSearchSuggestions([]);
        setActiveSuggestionIndex(-1);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!searchSuggestions.length) return;
        
        switch (e.key) {
            case "ArrowDown":
            case "Tab":
                e.preventDefault(); 
                const nextIndex = activeSuggestionIndex + 1 < searchSuggestions.length ? activeSuggestionIndex + 1 : 0;

                setSearch(searchSuggestions[nextIndex]);
                setActiveSuggestionIndex(nextIndex);
                setTempSearch(true);
                break;
        
            case "ArrowUp":
                e.preventDefault();
                const prevIndex = activeSuggestionIndex > 0 ? activeSuggestionIndex - 1 : searchSuggestions.length - 1;
                
                setSearch(searchSuggestions[prevIndex]);
                setActiveSuggestionIndex(prevIndex);
                setTempSearch(true);
                break;
        
            case "Enter":
                if (activeSuggestionIndex >= 0) {
                    e.preventDefault();
                    selectSuggestion(searchSuggestions[activeSuggestionIndex]);
                }
                setTempSearch(false);
                break;
        
            case "Escape":
                setSearchSuggestions([]);
                setActiveSuggestionIndex(-1);
                setTempSearch(false);
                break;
        
            default:
                setTempSearch(false);
                break;
        }
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
                            if (!tempSearch) {
                                e.target.value 
                                    ? handleSearchAutocomplete(e.target.value) 
                                    : setSearchSuggestions([]);
                                setSearch(e.target.value);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <Image 
                        src={search_icon} 
                        alt="Search icon" 
                        width={25} 
                        height={25}
                        onClick={() => {
                            onSearch(search)
                            setSearchSuggestions([]);
                        }}
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
                                setSearchSuggestions([]);
                            }}
                            className="cursor-pointer pl-1"
                        />
                    )}
                </form>
                {searchSuggestions.length > 0 && (
                    <ul className="absolute bg-white border border-black rounded-lg mt-1 w-full max-h-60 overflow-auto">
                        {searchSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={`p-2 cursor-pointer ${
                                    index === activeSuggestionIndex ? "bg-gray-200" : ""
                                }`}
                                onClick={() => {
                                    selectSuggestion(suggestion);
                                }}
                                onMouseEnter={() => setActiveSuggestionIndex(index)}
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