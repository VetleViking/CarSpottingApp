import React, { useEffect, useState } from "react";
import Button from "./Button";
import Spotimage from "./Spotimage";
import imageProcess, { CarDetails } from "@/api/chatGPT";
import LoadingAnimation from "./LoadingAnim";
import { get_models } from "@/api/cars";

const AskAi = () => {
    const [open, setOpen] = React.useState(false);

    const [files, setFiles] = useState<FileList | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [additional, setAdditional] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<CarDetails | null>(null);
    const [exists, setExists] = useState(false);

    const upload = async () => {
        if (!files) {
            return;
        }

        setLoading(true);
        
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Data = reader.result as string;
            const text = await imageProcess(base64Data, additional) as CarDetails;

            const exists = await ((text.make !== "cant recognize" && text.model !== "cant recognize") && get_models(text.make, text.model));

            if (exists && exists.length) {
                setExists(true);
            }

            setResults(text);
            console.log(text);
            setLoading(false);
        };
        reader.readAsDataURL(files[0]);
    }

    useEffect(() => {
        if (!files) {
            return;
        }

        const urls = Array.from(files).map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);


    return (
        <div className="fixed bottom-0 right-0 bg-black border-t-[6px] border-l-[6px] border-white p-4">
            {open ? <div className=" flex flex-col gap-2 items-center">
                <p className="text-white font-ListComponent">Here you can ask AI to identify a car from the chosen image.</p>
                <div className="flex items-center flex-col max-w-96 gap-2">
                    <input 
                        className="rounded-sm bg-black p-1 border border-[#9ca3af] text-[#9ca3af] font-ListComponent" 
                        type="file" 
                        accept="image/*" 
                        onChange={
                            (e) => {
                                setFiles(e.target.files);
                            }}/>
                        {previewUrls.length && <Spotimage images={previewUrls} />}
                    <textarea
                        className="rounded-sm w-full bg-black p-1 mb-2 border border-[#9ca3af] text-[#9ca3af] font-ListComponent"
                        placeholder="Additional information"
                        value={additional}
                        onChange={(e) => setAdditional(e.target.value)}
                    />
                </div>
                {results && <div className="flex flex-col gap-2">
                    <p className="text-white font-ListComponent">AI identified the car as:</p>
                    <p className="text-white font-ListComponent">{results.make} {results.model}</p>
                    <p className="text-white font-ListComponent">with a confidence of {results.confidence}</p>
                    <p className="text-white font-ListComponent">{exists ? "The car exists in the database" : "The car does not exist in the database"}</p>
                    {exists ? <Button text="Upload" onClick={() => {}} /> : <Button text="Add to database and upload" onClick={() => {}} />}
                </div>}
                <div className="flex justify-between mt-2 w-full">
                    <Button onClick={() => {
                        setOpen(false)
                        setFiles(null)
                        setPreviewUrls([])
                        setAdditional('')
                        setResults(null)
                        setExists(false)
                        }} text="Close" />
                    {loading ? <LoadingAnimation
                        className="text-base"
                        text="Asking AI"
                    /> : <Button onClick={() => upload()} 
                    text="Ask AI"/>}
                </div>        
                
            </div> : <div >
                <Button onClick={() => setOpen(true)} text="Ask AI" />
            </div>}
        </div>
    );
};

export default AskAi;