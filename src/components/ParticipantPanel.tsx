"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

interface Participant {
  socketId: string;
  username: string;
  isHost: boolean;
}

interface ParticipantPanelProps {
  roomCode: string;
  hostToken?: string;
  isHost: boolean;
  onClose: () => void;
}

export default function ParticipantPanel({
  roomCode,
  hostToken,
  isHost,
  onClose,
}: ParticipantPanelProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("participant-list", (list: Participant[]) => {
      setParticipants(list);
    });

    return () => {
      socket.off("participant-list");
    };
  }, []);

  function handleKick(targetSocketId: string) {
    if (!isHost || !hostToken) return;
    const socket = getSocket();
    socket.emit("host-kick", { roomCode, hostToken, targetSocketId });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-sm max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="font-semibold">
            Participants ({participants.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {participants.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">
              No participants yet
            </p>
          )}
          {participants.map((p) => (
            <div
              key={p.socketId}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {p.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm truncate">{p.username}</span>
                {p.isHost && (
                  <span className="text-[10px] bg-indigo-600/30 text-indigo-400 px-1.5 py-0.5 rounded font-medium shrink-0">
                    HOST
                  </span>
                )}
              </div>

              {isHost && !p.isHost && (
                <button
                  onClick={() => handleKick(p.socketId)}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-600/20 rounded transition-colors shrink-0"
                >
                  Kick
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
