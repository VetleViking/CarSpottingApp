import React from "react";

const ReleaseNotes  = ({ currentVersion, releaseNotes }: { currentVersion: string, releaseNotes: string[] }) => {
    return <div className="flex flex-col gap-2 w-48 p-2 bg-black border border-white">
        <p className="text-center text-xl text-white">Release Notes</p>
        <p className="text-center text-lg text-white">Version: {currentVersion}</p>
        <ul className="list-disc list-inside">
            {releaseNotes.map((note, index) => (
                <li key={index} className="text-white">{note}</li>
            ))}
        </ul>
    </div>
};

export default ReleaseNotes;