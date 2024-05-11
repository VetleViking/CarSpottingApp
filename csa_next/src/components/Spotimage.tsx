import React from "react";

type ImageProps = {
    image: string;
    alt?: string;
};

const Spotimage = ({ image, alt }: ImageProps) => {
    return (
        <div className="flex justify-center">
            <div className="max-w-96 rounded-lg bg-gray-700 p-1 m-2 border-2 border-gray-800">
                <img className="w-96 rounded-md" src={image} alt={alt ? alt : "spot"} />                
            </div>
        </div>
    );
};

export default Spotimage;