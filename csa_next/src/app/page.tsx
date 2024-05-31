"use client";
import { decode_jwt } from "@/api/api";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const encodedUsername = localStorage.getItem('token');

    const decode = async () => {
      const decoded = await decode_jwt(encodedUsername as string);
      setUsername(decoded as string);
    };

    decode();
  }, []);

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
