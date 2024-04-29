import React from 'react'
import { useEffect } from 'react'
import Search from './Search'

type HeaderProps = {
    search: string;
    setSearch: (search: string) => void;
};

export default function Header({search, setSearch}: HeaderProps) {
    return (
        <div>
            <div>
                <Search search={search} setSearch={setSearch} />
            </div>
        </div>
    )
}
