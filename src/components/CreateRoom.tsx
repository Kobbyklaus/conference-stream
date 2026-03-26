"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateRoom() {
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [hostToken, setHostToken] = useState("");
  const [error, setError] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");

  // Remove unused toLocalDateTimeStr function now that we use Date objects natively

  // Using DatePicker, min/max dates are just Date objects
  const minDateConfig = new Date();
  const maxDateConfig = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000);

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
      // Since DatePicker outputs Date objects, we just need to toISOString them.
      let parsedStart: string | undefined = undefined;
      let parsedEnd: string | undefined = undefined;

      if (startDate) parsedStart = startDate.toISOString();
      if (endDate) parsedEnd = endDate.toISOString();

      // Validate that if one is provided, the other doesn't HAVE to be provided for a scheduled start,
      // but logic states usually both are expected. The existing fix required both or neither.
      if ((startDate && !endDate) || (!startDate && endDate)) {
        throw new Error("Please fill in both the date and time, or leave both empty.");
      }

      // Validate end is after start
      if (startDate && endDate && endDate <= startDate) {
        throw new Error("End time must be after start time.");
      }

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          videoUrl,
          subtitleUrl: subtitleUrl || undefined,
          startTime: parsedStart,
          endTime: parsedEnd,
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
    <form onSubmit={handleCreate} noValidate className="bg-gray-900 rounded-xl p-6 space-y-4">
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
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube, Vimeo, Google Drive, or .mp4 URL"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Subtitle URL <span className="text-gray-600">(optional, .vtt file)</span>
        </label>
        <input
          type="text"
          value={subtitleUrl}
          onChange={(e) => setSubtitleUrl(e.target.value)}
          placeholder="https://example.com/subtitles.vtt"
          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Start <span className="text-gray-600">(optional)</span></label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="dd/MM/yyyy HH:mm"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable
            minDate={minDateConfig}
            maxDate={maxDateConfig}
            placeholderText="dd/mm/yyyy hh:mm"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            wrapperClassName="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">End <span className="text-gray-600">(optional)</span></label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="dd/MM/yyyy HH:mm"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable
            minDate={startDate || minDateConfig}
            maxDate={maxDateConfig}
            placeholderText="dd/mm/yyyy hh:mm"
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            wrapperClassName="w-full"
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
