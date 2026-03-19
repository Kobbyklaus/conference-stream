"use client";

import { getSocket } from "@/lib/socket";

const REACTIONS = ["👏", "🔥", "❤️", "😂", "🎉"];

export default function ReactionBar({ roomCode }: { roomCode: string }) {
  function sendReaction(emoji: string) {
    const socket = getSocket();
    socket.emit("send-reaction", { roomCode, emoji });
  }

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {REACTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => sendReaction(emoji)}
          className="text-xl hover:scale-125 active:scale-95 transition-transform bg-gray-800 hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
