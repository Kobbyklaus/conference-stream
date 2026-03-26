"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";

interface Comment {
  username: string;
  message: string;
  created_at: string;
  isHost?: boolean;
}

interface PrayerRequest {
  username: string;
  country: string;
  request: string;
  created_at: string;
}

interface ChatPanelProps {
  roomCode: string;
  username: string;
  isHost?: boolean;
}

type TabKey = "chat" | "prayer";

export default function ChatPanel({
  roomCode,
  username,
  isHost = false,
}: ChatPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [message, setMessage] = useState("");
  const [pinnedMessage, setPinnedMessage] = useState<Comment | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("chat");
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

    socket.on("user-joined", ({ username: user, country }: { username: string; country?: string }) => {
      const joinMsg = country ? `${user} joined from ${country}` : `${user} joined the conference`;
      setComments((prev) => [
        ...prev,
        {
          username: "System",
          message: joinMsg,
          created_at: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user-left", ({ username: user }: { username: string }) => {
      if (user) {
        setComments((prev) => [
          ...prev,
          {
            username: "System",
            message: `${user} left the conference`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    });

    socket.on(
      "new-prayer-request",
      (pr: { username: string; country: string; request: string }) => {
        setPrayerRequests((prev) => [
          ...prev,
          { ...pr, created_at: new Date().toISOString() },
        ]);
      }
    );

    return () => {
      socket.off("new-comment");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("new-prayer-request");
    };
  }, [roomCode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments, prayerRequests]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    const socket = getSocket();
    socket.emit("send-comment", {
      roomCode,
      username,
      message: message.trim(),
      isHost,
    });
    setMessage("");
  }

  function handlePin(comment: Comment) {
    if (!isHost) return;
    setPinnedMessage(comment);
  }

  function handleUnpin() {
    setPinnedMessage(null);
  }

  const exportChatLog = useCallback(() => {
    const lines = comments.map((c) => {
      const time = new Date(c.created_at).toLocaleString();
      if (c.username === "System") {
        return `[${time}] --- ${c.message} ---`;
      }
      const hostTag = c.isHost || c.username === "Host" ? " [HOST]" : "";
      return `[${time}] ${c.username}${hostTag}: ${c.message}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-log-${roomCode}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [comments, roomCode]);

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isHostMessage(comment: Comment) {
    return comment.isHost || comment.username === "Host";
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Live Chat</h2>
        {isHost && (
          <button
            onClick={exportChatLog}
            title="Export chat log"
            className="text-gray-400 hover:text-amber-400 transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("prayer")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === "prayer"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Prayer Requests
          {prayerRequests.length > 0 && (
            <span className="ml-1.5 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5">
              {prayerRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Chat Tab */}
      {activeTab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 relative">
            {/* Pinned Message */}
            {pinnedMessage && (
              <div className="sticky top-0 z-10 bg-amber-900/80 backdrop-blur border border-amber-700 rounded-lg px-3 py-2 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
                    Pinned Message
                  </span>
                  {isHost && (
                    <button
                      onClick={handleUnpin}
                      className="text-amber-400 hover:text-amber-200 text-xs"
                      title="Unpin"
                    >
                      Unpin
                    </button>
                  )}
                </div>
                <p className="text-sm text-amber-100">
                  <span className="font-semibold">{pinnedMessage.username}:</span>{" "}
                  {pinnedMessage.message}
                </p>
              </div>
            )}

            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center mt-8">
                No messages yet. Be the first to comment!
              </p>
            )}

            {comments.map((c, i) => (
              <div
                key={i}
                className={c.username === "System" ? "text-center" : ""}
              >
                {c.username === "System" ? (
                  <span className="text-xs text-gray-500 italic">
                    {c.message}
                  </span>
                ) : (
                  <div
                    className={`group rounded-lg px-3 py-2 ${
                      isHostMessage(c)
                        ? "border-l-4 border-amber-500 bg-amber-950/30"
                        : "bg-gray-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isHostMessage(c)
                            ? "text-amber-400"
                            : "text-indigo-400"
                        }`}
                      >
                        {c.username}
                      </span>
                      {isHostMessage(c) && (
                        <span className="text-[10px] font-bold uppercase bg-amber-600 text-white px-1.5 py-0.5 rounded">
                          Host
                        </span>
                      )}
                      <span className="text-[10px] text-gray-600 ml-auto">
                        {formatTime(c.created_at)}
                      </span>
                      {isHost && c.username !== "System" && (
                        <button
                          onClick={() => handlePin(c)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-amber-400 text-sm"
                          title="Pin message"
                        >
                          📌
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-200 break-words mt-0.5">
                      {c.message}
                    </p>
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
        </>
      )}

      {/* Prayer Requests Tab */}
      {activeTab === "prayer" && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {prayerRequests.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-8">
              No prayer requests yet.
            </p>
          )}
          {prayerRequests.map((pr, i) => (
            <div
              key={i}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-indigo-400">
                  {pr.username}
                </span>
                {pr.country && (
                  <span className="text-xs text-gray-500">
                    {pr.country}
                  </span>
                )}
                <span className="text-[10px] text-gray-600 ml-auto">
                  {formatTime(pr.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-200 break-words">{pr.request}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
