import { delete_spot } from "@/api/api";
import React from "react";

type ImageProps = {
    image: string;
    deletedata?: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ image, alt, deletedata }: ImageProps) => {


    return (
        <div className="flex justify-center">
            <div className="max-w-96 bg-white p-1">
                <img className="w-96 border border-black" src={image} alt={alt ? alt : "spot"} />                
                {(deletedata && deletedata.isOwner) && <button 
                    className="bg-[#e72328] text-white py-1 px-2 mt-1 border border-black italic"
                    onClick={() => {delete_spot(deletedata.make, deletedata.model, deletedata.key).then(() => window.location.reload())}}
                    >Delete</button>}
            </div>
        </div>
    );
};

export default Spotimage;