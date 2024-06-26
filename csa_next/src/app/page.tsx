"use client";
import Header from "@/components/Header";
import { useState } from "react";
import { ensure_login } from "@/functions/functions";

export default function Home() {
  const [username, setUsername] = useState('');

  ensure_login().then((username) => setUsername(username));

  if (!username) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <Header username={username} />
      <div className="mt-8 flex flex-col items-center">
          <p className="text-4xl text-white mb-2">Car Spotting App</p>
          <p className="text-xl text-white">Welcome, {username}</p>
      </div>
      <div className="flex justify-around pt-12">
        <button
          className='bg-[#e72328] text-white p-4 text-2xl border border-black italic text-nowrap'
          onClick={() => window.location.href = `/makes?username=${username}`}>My spots</button>
        <button
          className='bg-[#e72328] text-white text-2xl p-4 border border-black italic text-nowrap'
          onClick={() => window.location.href = `/makes`}>Upload Spot</button>
      </div>
    </div>
  );
}
