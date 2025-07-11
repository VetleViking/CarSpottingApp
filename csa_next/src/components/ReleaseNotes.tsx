import React, { useState } from "react";

const ReleaseNotes  = () => {
    const [title, setTitle] = useState<string>("");
    const [releaseNotes, setReleaseNotes] = useState<string>("");

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
    </div>
};

export default ReleaseNotes;