import React from "react";

type ListProps = {
    title: string;
    text?: string;
};

const ListComponent = ({ title, text }: ListProps) => {
    if (text) {
        return (
            <div className="rounded-lg bg-gray-700 px-1 py-2 m-1 border-2 border-gray-800 cursor-pointer">
                <p className="text-white pb-1">{title}</p>
                <p className="text-white">{text}</p>
            </div>
        );
    }
    
    return (
        // <div className="rounded-lg bg-gray-700 px-1 py-2 my-1 mx-2 border-2 border-gray-800 cursor-pointer">
        //     <p className="text-white">{title}</p>       
        // </div>

        // <div className="rounded-lg bg-[#e73d2e50] px-1 py-2 my-1 mx-2 border-2 border-[#f39301] cursor-pointer">
        //     <p className="text-white">{title}</p>       
        // </div>

        <div className="mx-1 bg-black px-1 py-2 border border-white cursor-pointer">
            <p className="text-white font-ListComponent">{title}</p>       
        </div>
    );
};

export default ListComponent;