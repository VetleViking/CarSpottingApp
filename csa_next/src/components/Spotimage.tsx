import { delete_spot } from "@/api/api";
import React from "react";

type ImageProps = {
    image: string;
    notes?: string;
    date?: string;
    deletedata?: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ image, notes, date, alt, deletedata }: ImageProps) => {


    return (
        <div className="flex justify-center">
            <div className="max-w-96 bg-white p-1">
                <img className="w-96 border border-black" src={image} alt={alt ? alt : "spot"} />
                <div className="flex justify-between">
                    <div className="flex flex-col items-start">
                        <p className="text-black text-center font-ListComponent">{date ? "Notes:" : ""}</p>
                        <p className="text-black text-center font-ListComponent">{notes ? notes : ""}</p>    
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-black text-center font-ListComponent">{date ? "Date spotted:" : ""}</p>
                        <p className="text-black text-center font-ListComponent">{date ? date : ""}</p>
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