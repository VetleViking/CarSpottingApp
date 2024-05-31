import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {    
    return (
        <input
            className="w-1/4 p-1 rounded-lg border border-black font-ListComponent"
            type="text"
            placeholder="Search..."
            value={search}

            onChange={(e) => {
                setSearch(e.target.value);
            }}
        />
    );
};

export default Search;