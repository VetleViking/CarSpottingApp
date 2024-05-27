import React from "react";

type ListProps = {
    title: string;
    text?: string;
};

const ListComponent = ({ title, text }: ListProps) => {
    // if (text) {
    //     return (
    //         <div className="rounded-lg bg-gray-700 px-1 py-2 m-1 border-2 border-gray-800 cursor-pointer">
    //             <p className="text-white pb-1">{title}</p>
    //             <p className="text-white">{text}</p>
    //         </div>
    //     );
    // }
    
    return (
        <div className="mx-1 bg-black border border-[#9ca3af] cursor-pointer flex justify-between">
            <p className="text-[#9ca3af] font-ListComponent px-1 py-2">{title}</p>
        </div>
    );
};

export default ListComponent;