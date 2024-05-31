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
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    
    useEffect(() => {
        if (!file) {
            return;
        }

        const url = URL.createObjectURL(file[0]);
        setPreviewUrl(url);
    }, [file]);

    useEffect(() => { 
        // TODO: go to spots page
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
                <p className="text-white text-center text-2xl m-4">Upload a spot of {make} {model}:</p>
                <input 
                className="rounded-sm bg-black p-1 mb-2 border border-[#9ca3af] text-[#9ca3af] font-ListComponent" 
                type="file" 
                accept="image/*" 
                onChange={
                    (e) => {
                        setFile(e.target.files);
                    }}/>
                {previewUrl && <Spotimage image={previewUrl} />}
                <div className="border border-[#9ca3af] p-2 my-2 rounded-sm">
                    <p className="text-white text-center text-xl">Optional:</p>
                    <div>
                        <div>
                            <p className="text-white text-center font-ListComponent m-1">Notes</p>
                            <textarea 
                                className="rounded-sm bg-black p-1 mb-2 border border-[#9ca3af] text-[#9ca3af] font-ListComponent w-full" 
                                placeholder="Enter notes here"
                                onChange={(e) => setNotes(e.target.value)}
                                />
                        </div>
                        <div>
                            <p className="text-white text-center font-ListComponent mb-1">Date spotted</p>
                            <div className="flex gap-4 mb-1">
                                <input 
                                    className="rounded-sm p-[2px] border border-[#9ca3af] font-ListComponent" 
                                    type="date" 
                                    onChange={(e) => setDate(e.target.value)}
                                    />
                                <button className="rounded-sm bg-[#9ca3af] text-black py-[4px] px-4 italic" onClick={
                                    () => {
                                        const today = new Date();
                                        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                        console.log(date);
                                    }
                                }>Today</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button  
                className="rounded-sm bg-[#9ca3af] text-black py-1 px-4 mt-1 italic" 
                onClick={() => setUploadButton(!uploadButton)}>Upload</button>
            </div>
        </div>
    );
};

export default UploadSpot;