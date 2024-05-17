import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {    
    return (
        <input
            className="w-1/4 p-2 rounded-lg"
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