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
        <div className="mx-1 bg-black border border-white cursor-pointer flex justify-between">
            <p className="text-white font-ListComponent px-1 py-2">{title}</p>
            <div className="flex ">       
                <div className="border-l-[20px] border-l-transparent border-b-[40px] border-r-[20px] mr-[-20px] border-white"></div>
                <div className="border-l-[20px] border-l-transparent border-r-[20px] border-b-[40px] mr-[-20px] border-[#e72328]"></div>
                <div className="border-l-[20px] border-l-transparent border-b-[40px] border-r-[10px] border-white"></div>
            </div>
        </div>
    );
};

export default ListComponent;