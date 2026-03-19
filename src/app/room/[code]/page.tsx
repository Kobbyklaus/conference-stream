"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import ViewerCount from "@/components/ViewerCount";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface Room {
  code: string;
  name: string;
  video_url: string;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const userParam = searchParams.get("user");

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(userParam || "");
  const [joined, setJoined] = useState(!!userParam);

  // Fetch room data on mount
  useEffect(() => {
    fetch(`/api/rooms?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      })
      .then((data) => {
        setRoom(data);
        // If user came with ?user= param, join immediately
        if (userParam) {
          const socket = getSocket();
          socket.emit("join-room", { roomCode: code, username: userParam });
        }
      })
      .catch(() => setError("Room not found. Check the code and try again."));

    return () => {
      disconnectSocket();
    };
  }, [code, userParam]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    const socket = getSocket();
    socket.emit("join-room", { roomCode: code, username: username.trim() });
    setJoined(true);
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-gray-400">{error}</p>
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading conference...</p>
      </main>
    );
  }

  // Show name prompt if user arrived via direct link (no ?user= param)
  if (!joined) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleJoin} className="bg-gray-900 rounded-xl p-8 space-y-5 w-full max-w-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">{room.name}</h1>
            <p className="text-gray-400 text-sm">Enter your name to join the conference</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Join Conference
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <a href="/" className="text-gray-400 hover:text-white text-sm">
            &larr; Home
          </a>
          <h1 className="text-lg font-semibold">{room.name}</h1>
          <span className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">
            {room.code}
          </span>
        </div>
        <ViewerCount roomCode={code} />
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            <VideoPlayer url={room.video_url} />
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-80 border-l border-gray-800 flex-shrink-0">
          <ChatPanel roomCode={code} username={username || "Anonymous"} />
        </div>
      </div>
    </main>
  );
}
