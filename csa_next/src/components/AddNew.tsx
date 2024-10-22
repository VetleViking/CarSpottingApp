"use client";

import React, { useState } from "react";
import Button from "./Button";
import Image from "next/image";
import down_arrow from "@/images/down_arrow.svg";
import { add_make, add_model } from "@/api/cars";
import LoadingAnimation from "./LoadingAnim";

interface AddNewProps {
    type: "make" | "model";
    make?: string;
};

const AddNew = ({ type, make }: AddNewProps) => {
    const [open, setOpen] = useState(false);
    const [newItem, setNewItem] = useState("");
    const [uploading, setUploading] = useState(false);

    function addNewHandler() {
        if (!newItem) return;

        if (type === "make") {
            setUploading(true);
            add_make(newItem).then(() => window.location.href = `/makes/selected?make=${newItem}`);
        } else if (type === "model" && make) {
            setUploading(true);
            add_model(make, newItem).then(() => window.location.href = `/makes/selected/modelselected?make=${make}&model=${newItem}`);
        }
    }

    return <div className="w-full cursor-pointer">
        <div className="flex justify-between rounded-sm p-1 border border-[#9ca3af]" onClick={() => {
                setNewItem("");
                setUploading(false);
                setOpen(!open);
            }}>
            <p className=" font-ListComponent text-[#9ca3af] my-1">Add new {type}</p>
            <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={open ? "transform rotate-180" : ""} />
        </div>
        {open && <div className='absolute bg-black border border-[#9ca3af] p-2'>
            <div className="flex items-center justify-center gap-4">
                <input
                    className='font-ListComponent border border-black p-1 w-full h-full rounded-md'
                    type='text'
                    placeholder={`New ${type}`}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                />
                {!uploading ? <Button onClick={addNewHandler}
                    text={`Add new ${type}`} /> : <LoadingAnimation text="Uploading" />}
            </div>
        </div>}
    </div>
};

export default AddNew;