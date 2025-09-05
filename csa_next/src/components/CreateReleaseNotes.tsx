"use client";

import { add_release_notes } from "@/api/users";
import React, { useState } from "react";

type CreateReleaseNotesProps = {
    currentVersion: string;
};

const CreateReleaseNotes  = ({ currentVersion }: CreateReleaseNotesProps) => {
    const [releaseNotes, setReleaseNotes] = useState<releaseNotesComponent[]>([
        { type: "title", text: "Placeholder Title" },
        { type: "text", text: "Placeholder Text" }
    ]);
    const [prevVersion, setPrevVersion] = useState<string>(currentVersion || "0.0.0");
    const [newVersion, setNewVersion] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const addNote = (type: "title" | "text") => {
        setReleaseNotes([...releaseNotes, { type, text: "" }]);
    };

    const updateNote = (index: number, text: string) => {
        const updatedNotes = [...releaseNotes];
        updatedNotes[index].text = text;
        setReleaseNotes(updatedNotes);
    };

    const uploadReleaseNotes = async () => {
        try {
            const response = await add_release_notes(releaseNotes, newVersion);

            if (response.error) {
                setError(response.error);
                return;
            }

            setMessage("Release notes uploaded successfully!");
            setPrevVersion(newVersion);
            setNewVersion("");
            setReleaseNotes([{ type: "title", text: "Placeholder title" }, { type: "text", text: "Placeholder text" }]);
        } catch (err) {
            setError("Failed to upload release notes.");
            return;
        }
    };

    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <p className="text-center text-xl text-white">Release Notes</p>
        <div className="flex gap-2">
            <p>Previous Version</p>
            <p>{prevVersion}</p>
            <input
                type="text"
                placeholder="New Version"
                value={newVersion}
                onChange={e => setNewVersion(e.target.value)}
                className="font-ListComponent"
            />
        </div>
        {releaseNotes.map((note, index) => (
            <div key={index} className="flex flex-col gap-1">
                <input
                    type="text"
                    placeholder={note.type === "title" ? "Title" : "Text"}
                    value={note.text}
                    onChange={e => updateNote(index, e.target.value)}
                    className="font-ListComponent"
                />
            </div>
        ))}
        <div className="flex gap-2 my-2">
            <button
                className="bg-white text-black py-1 px-2 italic"
                onClick={() => addNote("title")}>Add Title</button>
            <button
                className="bg-white text-black py-1 px-2 italic"
                onClick={() => addNote("text")}>Add Text</button>
            <button 
                className="bg-white text-black py-1 px-2 italic"
                onClick={() => uploadReleaseNotes()}>Upload Release Notes</button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p>{message}</p>}
    </div>
};

export default CreateReleaseNotes;