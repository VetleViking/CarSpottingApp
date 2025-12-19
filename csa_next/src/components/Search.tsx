"use client";

import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {
    return (
        <div className="flex justify-center">
            <input
                className="w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

export default Search;
