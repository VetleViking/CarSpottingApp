"use client";
import { decode_jwt } from "@/api/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const encodedUsername = localStorage.getItem('token');

    if (!encodedUsername) {
      window.location.href = '/login';
    }
    
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
      <div className="mt-8">
        <Link href={`/makes?username=${username}`} className="text-white p-4 bg-gray-700 rounded-lg m-4">
          My Spots
        </Link>
        <Link href="/makes" className="text-white p-4 bg-gray-700 rounded-lg m-4">
          Upload Spot
        </Link>
      </div>
    </div>
  );
}
