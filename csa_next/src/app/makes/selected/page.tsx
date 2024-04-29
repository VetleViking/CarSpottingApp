"use client";

export default function MakeSelected() {
    const queryParams = new URLSearchParams(window.location.search);
    const make = queryParams.get('make');

    console.log(make);

    return (
        <div>
            <h1>Selected Make: {make}</h1>
            {/* Rest of your component UI */}
        </div>
    );
};