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
  const [error, setError] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  const [paypalUrl, setPaypalUrl] = useState("");
  const [regionalLabel, setRegionalLabel] = useState("");
  const [regionalUrl, setRegionalUrl] = useState("");
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
          paypalUrl: paypalUrl || undefined,
          regionalLabel: regionalLabel || undefined,
          regionalUrl: regionalUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create room");
      }

      const data = await res.json();
      setRoomCode(data.code);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (roomCode) {
    const shareLink = `${typeof window !== "undefined" ? window.location.origin : ""}/room/${roomCode}`;

    return (
      <div className="surface rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-green-400">Room Created!</h2>

        {/* Room Code */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Room Code</p>
          <p className="text-4xl font-mono font-bold tracking-widest text-white">
            {roomCode}
          </p>
        </div>

        {/* Shareable Link */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-2">Share this link with attendees</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 input-field text-sm rounded-lg px-3 py-2 font-mono truncate"
            />
            <button
              onClick={() => copyToClipboard(shareLink, "link")}
              className="btn-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              {copied === "link" ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(roomCode, "code")}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2 rounded-lg text-sm transition-colors"
        >
          {copied === "code" ? "Copied!" : "Copy Code"}
        </button>
        <a
          href={`/room/${roomCode}`}
          className="block btn-primary w-full py-2 rounded-lg text-sm text-center"
        >
          Enter Room as Host
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate} noValidate className="surface rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Create a Conference</h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Conference Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Q1 Product Launch"
          className="w-full input-field rounded-lg px-3 py-2 text-sm"
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
          className="w-full input-field rounded-lg px-3 py-2 text-sm"
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
          className="w-full input-field rounded-lg px-3 py-2 text-sm"
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
            className="w-full input-field rounded-lg px-3 py-2 text-sm"
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
            className="w-full input-field rounded-lg px-3 py-2 text-sm"
            wrapperClassName="w-full"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Leave times empty to start immediately with no end time.
      </p>

      {/* Offerings */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-fuchsia-300">Offerings <span className="text-gray-600 font-normal">(optional)</span></p>
          <p className="text-xs text-gray-500 mt-0.5">Add giving links to show a “Give” button during the conference.</p>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">PayPal link</label>
          <input
            type="text"
            value={paypalUrl}
            onChange={(e) => setPaypalUrl(e.target.value)}
            placeholder="https://paypal.me/yourministry"
            className="w-full input-field rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Regional method name</label>
            <input
              type="text"
              value={regionalLabel}
              onChange={(e) => setRegionalLabel(e.target.value)}
              placeholder="e.g. Mercado Pago (Peru)"
              className="w-full input-field rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Regional link</label>
            <input
              type="text"
              value={regionalUrl}
              onChange={(e) => setRegionalUrl(e.target.value)}
              placeholder="https://..."
              className="w-full input-field rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-2.5 rounded-lg font-medium transition-colors"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}
