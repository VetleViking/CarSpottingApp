import React, { useState } from "react";

const ReleaseNotes  = () => {
    const [releaseNotes, setReleaseNotes] = useState<releaseNotesComponent[]>([
        { type: "title", text: "Placeholder Title" },
        { type: "text", text: "Placeholder Text" }
    ]);

    const addNote = (type: "title" | "text") => {
        setReleaseNotes([...releaseNotes, { type, text: "" }]);
    };

    const updateNote = (index: number, text: string) => {
        const updatedNotes = [...releaseNotes];
        updatedNotes[index].text = text;
        setReleaseNotes(updatedNotes);
    };

    const uploadReleaseNotes = async () => {
        console.log(releaseNotes);
    };

    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <p className="text-center text-xl text-white">Release Notes</p>
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
        <div className="flex gap-2 mt-2">
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
    </div>

    // Old
    // const [title, setTitle] = useState<string>("");
    // const [releaseNotes, setReleaseNotes] = useState<string>("");
    
    // const uploadReleaseNotes = async () => {}

    // return <div>
    //     <input
    //         className="w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent"
    //         type="text"
    //         placeholder="Release Title"
    //         value={title}
    //         onChange={e => setTitle(e.target.value)}
    //     />
    //     <textarea
    //         className="w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent"
    //         placeholder="Release Notes"
    //         value={releaseNotes}
    //         onChange={e => setReleaseNotes(e.target.value)}
    //         rows={10}
    //     ></textarea>
    //     <button
    //         className="bg-white text-black py-1 px-2 mt-1 italic"
    //         onClick={uploadReleaseNotes}
    //     >
    //         Add Release Notes
    //     </button>
    // </div>
};

export default ReleaseNotes;