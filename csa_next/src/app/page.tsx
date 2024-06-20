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
    </div>
  );
}
