"use client";

import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/lib/socket";

interface Reaction {
  id: number;
  emoji: string;
  x: number;
}

export default function ReactionOverlay({ roomCode }: { roomCode: string }) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const socket = getSocket();

    const handleReaction = ({ emoji }: { emoji: string }) => {
      const id = counterRef.current++;
      const x = 10 + Math.random() * 80; // random horizontal position 10-90%
      setReactions((prev) => [...prev, { id, emoji, x }]);

      // Remove after animation completes (2s)
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2000);
    };

    socket.on("new-reaction", handleReaction);

    return () => {
      socket.off("new-reaction", handleReaction);
    };
  }, [roomCode]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {reactions.map((r) => (
        <span
          key={r.id}
          className="absolute text-3xl animate-float-up"
          style={{ left: `${r.x}%`, bottom: "10%" }}
        >
          {r.emoji}
        </span>
      ))}
    </div>
  );
}
