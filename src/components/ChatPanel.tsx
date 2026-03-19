"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

interface Comment {
  username: string;
  message: string;
  created_at: string;
}

export default function ChatPanel({
  roomCode,
  username,
}: {
  roomCode: string;
  username: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing comments
    fetch(`/api/comments?room=${roomCode}`)
      .then((res) => res.json())
      .then((data) => setComments(data));

    const socket = getSocket();

    socket.on("new-comment", (comment: Comment) => {
      setComments((prev) => [...prev, comment]);
    });

    socket.on("user-joined", ({ username: user }: { username: string }) => {
      setComments((prev) => [
        ...prev,
        { username: "System", message: `${user} joined the conference`, created_at: new Date().toISOString() },
      ]);
    });

    socket.on("user-left", ({ username: user }: { username: string }) => {
      if (user) {
        setComments((prev) => [
          ...prev,
          { username: "System", message: `${user} left the conference`, created_at: new Date().toISOString() },
        ]);
      }
    });

    return () => {
      socket.off("new-comment");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [roomCode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const socket = getSocket();
    socket.emit("send-comment", { roomCode, username, message: message.trim() });
    setMessage("");
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="font-semibold text-lg">Live Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-8">
            No messages yet. Be the first to comment!
          </p>
        )}
        {comments.map((c, i) => (
          <div key={i} className={c.username === "System" ? "text-center" : ""}>
            {c.username === "System" ? (
              <span className="text-xs text-gray-500 italic">{c.message}</span>
            ) : (
              <div>
                <span className="text-sm font-semibold text-indigo-400">
                  {c.username}
                </span>
                <p className="text-sm text-gray-200 break-words">{c.message}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={500}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
