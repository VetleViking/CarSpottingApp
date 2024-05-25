import { upload_spot } from "@/api/api";
import React, { useEffect, useState } from "react";
import Spotimage from "./Spotimage";

type SpotProps = {
    make: string;
    model: string;
};

const UploadSpot = ({ make, model }: SpotProps) => {
    const [uploadButton, setUploadButton] = useState(false);
    const [file, setFile] = useState<FileList | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    
    useEffect(() => {
        if (!file) {
            return;
        }

        const url = URL.createObjectURL(file[0]);
        setPreviewUrl(url);
    }, [file]);

    useEffect(() => { 
        if (!file) {
            return;
        }

        const upload = async () => {
            upload_spot(make, model, file[0]);
        };

        upload();
    }, [uploadButton]);

    return (
        <div className="flex justify-center">
            <div className="flex items-center flex-col max-w-96 ">
                <p className="text-white text-center text-xl m-4">Upload a spot of {make} {model}:</p>
                <input 
                className="rounded-sm bg-black p-1 mb-2 border border-white text-white font-ListComponent" 
                type="file" 
                accept="image/*" 
                onChange={
                    (e) => {
                        setFile(e.target.files);
                    }}/>
                {previewUrl && <Spotimage image={previewUrl} />}
                <button 
                className="bg-white text-black py-1 px-4 mt-1 italic" 
                onClick={() => setUploadButton(!uploadButton)}>Upload</button>
            </div>
        </div>
    );
};

export default UploadSpot;