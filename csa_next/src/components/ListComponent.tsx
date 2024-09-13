import React from "react";

const ListComponent = (title: string) => {
    return <div className="mx-1 bg-black border border-[#9ca3af] cursor-pointer flex justify-between">
        <p className="text-[#9ca3af] font-ListComponent px-1 py-2 text-nowrap">{title}</p>
    </div>
};

export default ListComponent;