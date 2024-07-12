import { delete_spot, edit_spot } from "@/api/cars";
import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";

type ImageProps = {
    images: string[];
    notes?: string;
    date?: string;
    spotdata?: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ images, notes, date, alt, spotdata }: ImageProps) => {
    const [editing, setEditing] = useState(false);
    const [newNotes, setNewNotes] = useState(notes || "");
    const [newDate, setNewDate] = useState(date || "");

    async function uploadEdit() {
        if (spotdata) {
            await edit_spot(spotdata.make, spotdata.model, spotdata.key, newNotes, newDate);

            window.location.reload();
        }
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-96 bg-white p-1">
                <div className="flex flex-col gap-1">
                    {images.map((image, id) => (
                        <Image key={id} src={image} alt={alt ?? ""} width={800} height={1000} className="w-full"/>
                    ))}
                </div>
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col items-start">
                        <p className="text-black font-ListComponent">{(notes || editing) ? "Notes:" : ""}</p>
                        {editing ? 
                            <input type="text" className="border border-black font-ListComponent" value={newNotes} alt="Notes:" onChange={(e) => setNewNotes(e.target.value)}/> 
                        :     
                            <p className="text-black font-ListComponent break-all">{notes ? notes : ""}</p>    
                        }    
                    </div>
                    <div className="flex flex-col items-start min-w-max">
                        <p className="text-black font-ListComponent">{(date || editing) ? "Date spotted:" : ""}</p>
                        {editing ? 
                            <input type="date" className="border border-black font-ListComponent" value={newDate} onChange={(e) => setNewDate(e.target.value)}/> 
                        :                    
                            <p className="text-black font-ListComponent">{date ? date : ""}</p>
                        }
                    </div>
                </div>                
                {(spotdata && spotdata.isOwner) && <div className="flex justify-between">
                    <Button 
                        text="Delete"
                        className="border border-black mt-1"
                        onClick={() => {delete_spot(spotdata.make, spotdata.model, spotdata.key).then(() => window.location.reload())}}
                    />
                    {editing ? <Button
                            text="Save"
                            className="border border-black mt-1"
                            onClick={() => {
                                setEditing(false);
                                uploadEdit().then(() => window.location.reload())}}
                        /> : <Button
                            text="Edit"
                            className="border border-black mt-1"
                            onClick={() => setEditing(true)}
                        />
                    }
                </div>}
            </div>
        </div>
    );
};

export default Spotimage;