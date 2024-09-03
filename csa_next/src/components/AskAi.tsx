import React, { useState } from "react";
import Button from "./Button";
import Spotimage from "./Spotimage";

const AskAi = () => {
    const [open, setOpen] = React.useState(false);

    const [files, setFiles] = useState<FileList | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [additional, setAdditional] = useState('');

    const upload = async () => {
        if (!files) {
            return;
        }


        // setLoading(true);
        // setUploading(true);
    }


    return (
        <div className="fixed bottom-0 right-0 bg-white p-4">
            {open ? <div className="">
                <div>
                <div className="flex items-center flex-col max-w-96 ">
                    <input 
                        className="rounded-sm bg-black p-1 mb-2 border border-[#9ca3af] text-[#9ca3af] font-ListComponent" 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={
                            (e) => {
                                setFiles(e.target.files);
                            }}/>
                        <Spotimage images={previewUrls} />
                    <Button  
                        text="Ask AI"
                        onClick={() => upload()}/>
                </div>
                </div>
                <Button onClick={() => setOpen(false)} text="Close" />
            </div> : <div >
                <Button onClick={() => setOpen(true)} text="Ask AI" />
            </div>}
        </div>
    );
};

export default AskAi;