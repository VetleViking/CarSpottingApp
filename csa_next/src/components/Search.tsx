import React from "react";

type SearchProps = {
    search: string;
    setSearch: (search: string) => void;
};

const Search = ({ search, setSearch }: SearchProps) => {    
    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={search}

                onChange={(e) => {
                    setSearch(e.target.value);
                }}
            />
        </div>
    );
};

export default Search;