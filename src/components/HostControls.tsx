"use client";

import { useState } from "react";
import { getSocket } from "@/lib/socket";

interface HostControlsProps {
  roomCode: string;
  hostToken: string;
}

export default function HostControls({ roomCode, hostToken }: HostControlsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleEndStream() {
    const socket = getSocket();
    socket.emit("host-end-stream", { roomCode, hostToken });
    setShowConfirm(false);
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border-t border-gray-800">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        You are the host
      </div>

      <div className="ml-auto">
        {showConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-400">End stream for everyone?</span>
            <button
              onClick={handleEndStream}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Yes, End
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-600/30"
          >
            End Stream
          </button>
        )}
      </div>
    </div>
  );
}
