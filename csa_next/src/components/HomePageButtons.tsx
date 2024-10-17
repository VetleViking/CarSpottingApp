"use client";
import React from "react";
import Button from "./Button";

interface HomePageButtonsProps {
    username: string;
};

const HomePageButtons = ({username}: HomePageButtonsProps) => {
    return <div className="flex justify-around pt-12">
    <Button
        onClick={() => window.location.href = `/makes?username=${username}`}
        text="My Spots"
        className="text-2xl"
    />
    <Button
        onClick={() => window.location.href = `/discover`}
        text="Discover"
        className="text-2xl"
    />
    <Button
        onClick={() => window.location.href = `/makes`}
        text="Upload Spot"
        className="text-2xl"
    />
</div>
};

export default HomePageButtons;