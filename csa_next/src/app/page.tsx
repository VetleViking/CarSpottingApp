"use client";
import Header from "@/components/Header";
import { useState } from "react";
import { ensure_login } from "@/functions/functions";
import { upload_makes } from "@/api/api";

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
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => upload_makes()}>upload</button>
      </div>
    </div>
  );
}
