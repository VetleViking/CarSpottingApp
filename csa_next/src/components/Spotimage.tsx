import { delete_spot } from "@/api/cars";
import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";

type ImageProps = {
    images: string[];
    notes?: string;
    date?: string;
    deletedata?: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ images, notes, date, alt, deletedata }: ImageProps) => {
    const [editing, setEditing] = useState(false);

    async function uploadEdit() {
        console.log("uploading edit");
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
                        <p className="text-black font-ListComponent">{notes ? "Notes:" : ""}</p>
                        {editing ? 
                            <input type="text" className="border border-black" value={date} onChange={(e) => date = e.target.value}/> 
                        :     
                            <p className="text-black font-ListComponent break-all">{notes ? notes : ""}</p>    
                        }    
                    </div>
                    <div className="flex flex-col items-start min-w-max">
                        <p className="text-black font-ListComponent">{date ? "Date spotted:" : ""}</p>
                        {editing ? 
                            <input type="date" className="border border-black" value={date} onChange={(e) => date = e.target.value}/> 
                        :                    
                            <p className="text-black font-ListComponent">{date ? date : ""}</p>
                        }
                    </div>
                </div>                
                {(deletedata && deletedata.isOwner) && <div className="flex justify-between">
                    <Button 
                        text="Delete"
                        className="border border-black mt-1"
                        onClick={() => {delete_spot(deletedata.make, deletedata.model, deletedata.key).then(() => window.location.reload())}}
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