import React, { useState } from "react";

const ReleaseNotes  = () => {
    const [title, setTitle] = useState<string>("");
    const [releaseNotes, setReleaseNotes] = useState<string>("");
    
    const uploadReleaseNotes = async () => {}

    return <div>
        <input
            className="w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent"
            type="text"
            placeholder="Release Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
        />
        <textarea
            className="w-full max-w-2xl mx-1 mb-4 p-1 rounded-lg border border-black font-ListComponent"
            placeholder="Release Notes"
            value={releaseNotes}
            onChange={e => setReleaseNotes(e.target.value)}
            rows={10}
        ></textarea>
        <button
            className="bg-white text-black py-1 px-2 mt-1 italic"
            onClick={uploadReleaseNotes}
        >
            Add Release Notes
        </button>
    </div>
};

export default ReleaseNotes;