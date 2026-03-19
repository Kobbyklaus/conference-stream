"use client";

import { useState } from "react";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [hostToken, setHostToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          videoUrl,
          startTime: startTime ? new Date(startTime).toISOString() : undefined,
          endTime: endTime ? new Date(endTime).toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create room");
      }

      const data = await res.json();
      setRoomCode(data.code);
      setHostToken(data.hostToken);

      // Store host token in localStorage
      localStorage.setItem(`host_${data.code}`, data.hostToken);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (roomCode) {
    const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/room/${roomCode}`;

    return (
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-green-400">Room Created!</h2>

        {/* Room Code */}
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Room Code</p>
          <p className="text-4xl font-mono font-bold tracking-widest text-white">
            {roomCode}
          </p>
        </div>

        {/* Shareable Link */}
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-2">Share this link with attendees</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 bg-gray-700 text-white text-sm rounded-lg px-3 py-2 font-mono truncate focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(shareLink, "link")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              {copied === "link" ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(roomCode, "code")}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors"
        >
          {copied === "code" ? "Copied!" : "Copy Code"}
        </button>
        <a
          href={`/room/${roomCode}?user=Host&hostToken=${hostToken}`}
          className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm text-center font-medium transition-colors"
        >
          Enter Room as Host
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate} className="bg-gray-900 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Create a Conference</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Conference Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Q1 Product Launch"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Video URL</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube or Vimeo URL"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Start Time <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            End Time <span className="text-gray-600">(optional)</span>
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Leave times empty to start immediately with no end time.
      </p>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}
