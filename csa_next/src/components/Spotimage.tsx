import { delete_spot } from "@/api/api";
import React from "react";
import Image from "next/image";

type ImageProps = {
    images: string[];
    notes?: string;
    date?: string;
    deletedata?: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ images, notes, date, alt, deletedata }: ImageProps) => {
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
                        <p className="text-black font-ListComponent">{date ? "Notes:" : ""}</p>
                        <p className="text-black font-ListComponent break-all">{notes ? notes : ""}</p>    
                    </div>
                    <div className="flex flex-col items-start min-w-max">
                        <p className="text-black font-ListComponent">{date ? "Date spotted:" : ""}</p>
                        <p className="text-black font-ListComponent">{date ? date : ""}</p>
                    </div>
                </div>                
                {(deletedata && deletedata.isOwner) && <button 
                    className="bg-[#e72328] text-white py-1 px-2 mt-1 border border-black italic"
                    onClick={() => {delete_spot(deletedata.make, deletedata.model, deletedata.key).then(() => window.location.reload())}}
                    >Delete</button>}
            </div>
        </div>
    );
};

export default Spotimage;