"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import ViewerCount from "@/components/ViewerCount";
import HostControls from "@/components/HostControls";
import ParticipantPanel from "@/components/ParticipantPanel";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface Room {
  code: string;
  name: string;
  video_url: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const userParam = searchParams.get("user");
  const hostTokenParam = searchParams.get("hostToken");

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(userParam || "");
  const [joined, setJoined] = useState(!!userParam);
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [roomStatus, setRoomStatus] = useState<string>("live");
  const [showParticipants, setShowParticipants] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [countdown, setCountdown] = useState("");

  // Retrieve or store host token
  useEffect(() => {
    if (hostTokenParam) {
      // Store token and strip from URL
      localStorage.setItem(`host_${code}`, hostTokenParam);
      setHostToken(hostTokenParam);
      setIsHost(true);
      // Clean up URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("hostToken");
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      // Check localStorage
      const stored = localStorage.getItem(`host_${code}`);
      if (stored) {
        setHostToken(stored);
        setIsHost(true);
      }
    }
  }, [code, hostTokenParam]);

  // Fetch room data on mount
  useEffect(() => {
    fetch(`/api/rooms?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      })
      .then((data) => {
        setRoom(data);
        setRoomStatus(data.status || "live");

        // If user came with ?user= param, join immediately
        if (userParam) {
          const socket = getSocket();
          const storedToken = localStorage.getItem(`host_${code}`);
          socket.emit("join-room", {
            roomCode: code,
            username: userParam,
            hostToken: hostTokenParam || storedToken || undefined,
          });
        }
      })
      .catch(() => setError("Room not found. Check the code and try again."));

    return () => {
      disconnectSocket();
    };
  }, [code, userParam, hostTokenParam]);

  // Listen for room lifecycle events
  useEffect(() => {
    const socket = getSocket();

    socket.on("room-ended", () => {
      setRoomStatus("ended");
    });

    socket.on("room-started", () => {
      setRoomStatus("live");
    });

    socket.on("you-were-kicked", () => {
      setKicked(true);
      disconnectSocket();
    });

    return () => {
      socket.off("room-ended");
      socket.off("room-started");
      socket.off("you-were-kicked");
    };
  }, []);

  // Countdown timer for scheduled rooms
  useEffect(() => {
    if (roomStatus !== "scheduled" || !room?.start_time) return;

    function updateCountdown() {
      const now = new Date();
      const start = new Date(room!.start_time!);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("");
        // Auto-start if host
        if (isHost && hostToken) {
          const socket = getSocket();
          socket.emit("host-start-stream", { roomCode: code, hostToken });
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [roomStatus, room?.start_time, isHost, hostToken, code]);

  const handleStartNow = useCallback(() => {
    if (!isHost || !hostToken) return;
    const socket = getSocket();
    socket.emit("host-start-stream", { roomCode: code, hostToken });
  }, [isHost, hostToken, code]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    const socket = getSocket();
    socket.emit("join-room", {
      roomCode: code,
      username: username.trim(),
      hostToken: hostToken || undefined,
    });
    setJoined(true);
  }

  // Kicked screen
  if (kicked) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Removed</h1>
          <p className="text-gray-400">You have been removed from this conference.</p>
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // Error screen
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

  // Ended screen
  if (roomStatus === "ended") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-2">Conference Ended</h1>
          <p className="text-gray-500">{room.name} has ended.</p>
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
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
            {roomStatus === "scheduled" && countdown && (
              <p className="text-indigo-400 text-sm mt-2">
                Starts in {countdown}
              </p>
            )}
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

  // Scheduled / waiting screen
  if (roomStatus === "scheduled") {
    return (
      <main className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
              &larr;
            </a>
            <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
          </div>
          <ViewerCount roomCode={code} />
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:flex-[3] p-4 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">⏳</div>
              <h2 className="text-2xl font-bold">Conference starts soon</h2>
              {countdown && (
                <p className="text-4xl font-mono text-indigo-400">{countdown}</p>
              )}
              {room.start_time && (
                <p className="text-gray-400 text-sm">
                  Scheduled for {new Date(room.start_time).toLocaleString()}
                </p>
              )}
              {isHost && (
                <button
                  onClick={handleStartNow}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg"
                >
                  Start Now
                </button>
              )}
            </div>
          </div>

          {/* Chat available during waiting */}
          <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-gray-800 min-h-0">
            <ChatPanel roomCode={code} username={username || "Anonymous"} />
          </div>
        </div>
      </main>
    );
  }

  // Live room
  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
            &larr;
          </a>
          <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
          <span className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
            {room.code}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isHost && (
            <button
              onClick={() => setShowParticipants(true)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Participants
            </button>
          )}
          <ViewerCount roomCode={code} />
        </div>
      </header>

      {/* Content - stacks vertically on mobile, side by side on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video area + host controls */}
        <div className="w-full md:flex-[3] flex flex-col min-w-0">
          <div className="flex-1 p-2 md:p-4 flex items-start md:items-center justify-center">
            <div className="w-full">
              <VideoPlayer
                url={room.video_url}
                isHost={isHost}
                roomCode={code}
                hostToken={hostToken || undefined}
              />
            </div>
          </div>
          {isHost && hostToken && (
            <HostControls roomCode={code} hostToken={hostToken} />
          )}
        </div>

        {/* Chat - below video on mobile, sidebar on desktop */}
        <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-gray-800 min-h-0">
          <ChatPanel roomCode={code} username={username || "Anonymous"} />
        </div>
      </div>

      {/* Participant panel modal */}
      {showParticipants && (
        <ParticipantPanel
          roomCode={code}
          hostToken={hostToken || undefined}
          isHost={isHost}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {/* End time warning */}
      {room.end_time && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          Ends: {new Date(room.end_time).toLocaleString()}
        </div>
      )}
    </main>
  );
}
