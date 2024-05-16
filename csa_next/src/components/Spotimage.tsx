import { delete_spot } from "@/api/api";
import React from "react";

type ImageProps = {
    image: string;
    deletedata: { make: string; model: string; key: string; isOwner?: boolean;}
    alt?: string;
};

const Spotimage = ({ image, alt, deletedata }: ImageProps) => {


    return (
        <div className="flex justify-center">
            <div className="max-w-96 rounded-lg bg-gray-700 p-1 m-2 border-2 border-gray-800">
                <img className="w-96 rounded-md" src={image} alt={alt ? alt : "spot"} />                
                {deletedata.isOwner && <button 
                    className="bg-red-500 text-white p-2 rounded-lg mt-2"
                    onClick={() => {delete_spot(deletedata.make, deletedata.model, deletedata.key).then(() => window.location.reload())}}
                    >Delete</button>}
            </div>
        </div>
    );
};

export default Spotimage;