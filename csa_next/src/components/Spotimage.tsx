import { add_tag, delete_spot, edit_spot, get_tags } from "@/api/cars";
import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import down_arrow from "../images/down-arrow.svg";


type ImageProps = {
    images: string[];
    tags?: string[];
    notes?: string;
    date?: string;
    spotdata?: { make: string; model: string; key: string; isOwner?: boolean; }
    alt?: string;
};

const Spotimage = ({ images, tags, notes, date, alt, spotdata }: ImageProps) => {
    const [editing, setEditing] = useState(false);
    const [newNotes, setNewNotes] = useState(notes || "");
    const [newDate, setNewDate] = useState(date || "");
    const [newTags, setNewTags] = useState(tags || []);
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagOpen, setTagOpen] = useState(false);
    const [newTag, setNewTag] = useState('');

    async function uploadEdit() {
        if (spotdata) {
            await edit_spot(spotdata.make, spotdata.model, spotdata.key, newNotes, newDate, newTags);

            window.location.reload();
        }
    }

    if (editing && !tagList.length) {
        if (typeof window !== 'undefined') {
            get_tags().then((tags) => setTagList(tags));
        }
    }

    return (
        <div className="flex justify-center">
            <div className="max-w-96 bg-white p-1">
                {editing && <div className="pb-1">
                    <div className="flex justify-between p-1 border border-black" onClick={() => setTagOpen(!tagOpen)}>
                        <p className=" font-ListComponent">Select new tag(s)</p>
                        <Image src={down_arrow} alt="Down arrow" width={15} height={15} className={tagOpen ? "transform rotate-180" : ""} />
                    </div>
                    {tagOpen &&
                        <div className="flex flex-col gap-1 p-1 border-x border-b border-black">
                            <div className="flex justify-between">
                                <input
                                    type="text"
                                    className="p-1 border border-black font-ListComponent w-36"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add tag" />
                                <Button
                                    text="Add"
                                    className="py-1 px-4"
                                    onClick={() => {
                                        add_tag(newTag).then((res) => {
                                            if (res.message == 'Tag already exists') {
                                                setNewTag('');
                                                return;
                                            }
                                            setTagList([...tagList, newTag]);
                                            setNewTag('');
                                        });
                                    }}
                                />
                            </div>
                            {tagList.map((tag, id) => (
                                <div key={id} className="flex justify-between items-center">
                                    <p className="font-ListComponent">{tag}</p>
                                    <input type="checkbox"
                                        checked={newTags.includes(tag)}
                                        onChange={() => {
                                            if (newTags.includes(tag)) {
                                                setNewTags(newTags.filter(item => item !== tag));
                                                return;
                                            }
                                            setNewTags([...newTags, tag]);
                                        }} />
                                </div>
                            ))}
                        </div>}
                </div>}

                {(tags && tags[0] && !editing) && <div className="flex flex-col gap-1 py-1">
                    <p className="font-ListComponent">Tags:</p>
                    <div className="flex gap-1">
                        {tags.map((tag, id) => <div key={id} className="bg-gray-200 px-2 rounded font-ListComponent">{tag}</div>)}
                    </div>
                </div>}

                <div className="flex flex-col gap-1">
                    {images.map((image, id) => (
                        <Image key={id} src={image} alt={alt ?? ""} width={800} height={1000} className="w-full" />
                    ))}
                </div>
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col items-start">
                        <p className="text-black font-ListComponent">{(notes || editing) ? "Notes:" : ""}</p>
                        {editing ?
                            <input type="text" className="border border-black font-ListComponent" value={newNotes} alt="Notes:" onChange={(e) => setNewNotes(e.target.value)} />
                            :
                            <p className="text-black font-ListComponent break-all">{notes ? notes : ""}</p>
                        }
                    </div>
                    <div className="flex flex-col items-start min-w-max">
                        <p className="text-black font-ListComponent">{(date || editing) ? "Date spotted:" : ""}</p>
                        {editing ?
                            <input type="date" className="border border-black font-ListComponent" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                            :
                            <p className="text-black font-ListComponent">{date ? date : ""}</p>
                        }
                    </div>
                </div>
                {(spotdata && spotdata.isOwner) && <div className="flex justify-between">
                    <Button
                        text="Delete"
                        className="border border-black mt-1"
                        onClick={() => { delete_spot(spotdata.make, spotdata.model, spotdata.key).then(() => window.location.reload()) }}
                    />
                    {editing ? <Button
                        text="Save"
                        className="border border-black mt-1"
                        onClick={() => {
                            setEditing(false);
                            uploadEdit().then(() => window.location.reload())
                        }}
                    /> : <Button
                        text="Edit"
                        className="border border-black mt-1"
                        onClick={() => setEditing(true)}
                    />
                    }
                </div>}
            </div>
        </div>
    );
};

export default Spotimage;