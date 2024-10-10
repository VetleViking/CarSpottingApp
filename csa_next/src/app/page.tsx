"use client";
import Header from "@/components/Header";
import { useState } from "react";
import { ensure_login } from "@/functions/functions";
import Button from "@/components/Button";
import LoadingAnimation from "@/components/LoadingAnim";

export default function Home() {
    const [username, setUsername] = useState('');

    ensure_login().then(setUsername);

    if (!username) return <LoadingAnimation text="Loading" />

    return <div>
        <Header username={username} />
        <div className="mt-8 flex flex-col items-center">
            <p className="text-4xl text-white mb-2">Car Spotting App</p>
            <p className="text-xl text-white">Welcome, {username}</p>
        </div>
        <div className="flex justify-around pt-12">
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
    </div>
}
