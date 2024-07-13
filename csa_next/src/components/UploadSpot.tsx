import { upload_spot } from "@/api/cars";
import React, { useEffect, useState } from "react";
import Spotimage from "./Spotimage";
import { ensure_login } from "@/functions/functions";
import LoadingAnimation from "./LoadingAnim";
import Button from "./Button";
import down_arrow from "../images/down-arrow.svg";
import Image from "next/image";

type SpotProps = {
    make: string;
    model: string;
};

const UploadSpot = ({ make, model }: SpotProps) => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagOpen, setTagOpen] = useState(false);

    if (!username) {
        ensure_login().then((username) => setUsername(username));
    }

    if (!tagList.length) {
        // const fetchData = async () => {
        //     const data = await get_tags();
        //     setTagList(data);
        // };

        // fetchData();

        setTagList(['Tag 1', 'Tag 2', 'Tag 3']);
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


    const upload = async () => {
        console.log(tags);

        if (!files) {
            return;
        }

        setLoading(true);
        setUploading(true);
        
        const fileArray = Array.from(files);
        const data = await upload_spot(make, model, fileArray, notes, date);

        
        if (data === null || data === undefined || data.error) {
            setLoading(false);
            return;
        }

        setMessage('Spot uploaded');
        setFiles(null);
        setPreviewUrls([]);
        setNotes('');
        setDate('');
        setLoading(false);

        // window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}&username=${username}`;
    };


    return (
        <div className="flex flex-col items-center">
            {loading ? (
                <LoadingAnimation
                    text="Uploading spot"
                />
            ) : (
                <div className="flex items-center flex-col max-w-96 ">
                    <p className="text-white text-center text-2xl m-4">Upload a spot of {make} {model}:</p>
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
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        />
                                    <button className="rounded-sm bg-[#9ca3af] text-black py-[4px] px-4 italic" onClick={
                                        () => {
                                            const today = new Date();
                                            const date = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                                            setDate(date);
                                        }
                                    }>Today</button>
                                </div>
                            </div>
                            <div>
                                <p className="text-white text-center font-ListComponent mb-1">Tag</p>
                                <div className="flex justify-between rounded-sm p-1 border border-[#9ca3af]" onClick={() => setTagOpen(!tagOpen)}>
                                    <p className=" font-ListComponent text-[#9ca3af]">Select tag(s)</p>
                                    <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={tagOpen ? "transform rotate-180" : ""}/>
                                </div>
                                {tagOpen &&
                                    <div className="flex flex-col gap-1 p-1 border border-[#9ca3af]">
                                        <div className="flex justify-between">
                                            <input type="text" className="rounded-sm bg-black p-1 border border-[#9ca3af] text-[#9ca3af] font-ListComponent w-36" placeholder="Add tag"/>
                                            <button 
                                                className="rounded-sm bg-[#9ca3af] text-black py-[4px] px-4 italic"
                                                onClick={() => {
                                                    // Upload tag, refresh tag list and add tag to tags
                                                }}                    
                                                >Add</button> 
                                        </div>  
                                        {tagList.map((tag, id) => (
                                            <div key={id} className="flex justify-between items-center">
                                                <p className="font-ListComponent text-[#9ca3af]">{tag}</p>
                                                <input type="checkbox" 
                                                    checked={tags.includes(tag)}
                                                    onChange={() => {
                                                        if (tags.includes(tag)) {
                                                            setTags(tags.filter(item => item !== tag));
                                                            return;
                                                        }
                                                        setTags([...tags, tag]);
                                                    }}/>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <button  
                    className="rounded-sm bg-[#9ca3af] text-black py-1 px-4 mt-1 italic" 
                    onClick={() => upload()}>Upload</button>
                </div>
            )}
            {message && <p className="text-white text-center text-2xl mt-6 mb-2 font-ListComponent">{message}</p>}
            {uploading && 
                <div className="flex gap-2 mt-2">
                    <Button
                        text="Upload another spot"
                        onClick={() => window.location.href = `/makes`}
                    />
                    <Button
                        text="View the spot"
                        onClick={() => window.location.href = `/makes/selected/modelselected?make=${make}&model=${model}&username=${username}`}
                    />
                </div>
            }
        </div>
    );
};

export default UploadSpot;