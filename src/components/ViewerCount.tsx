"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function ViewerCount({ roomCode }: { roomCode: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();

    socket.on("viewer-count", (newCount: number) => {
      setCount(newCount);
    });

    // Request the current viewer count immediately upon mounting
    socket.emit("request-viewer-count", roomCode);

    return () => {
      socket.off("viewer-count");
    };
  }, [roomCode]);

  return (
    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <span className="font-medium">{count}</span>
      <span className="text-gray-400">watching</span>
    </div>
  );
}
