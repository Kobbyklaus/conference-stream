"use client";

import { useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import InviteModal from "@/components/InviteModal";

interface HostControlsProps {
  roomCode: string;
  hostToken: string;
}

interface AttendeeRecord {
  username: string;
  country: string;
  joinedAt: string;
}

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function HostControls({ roomCode, hostToken }: HostControlsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [exportingAttendance, setExportingAttendance] = useState(false);
  const [exportingChat, setExportingChat] = useState(false);

  function handleEndStream() {
    const socket = getSocket();
    socket.emit("host-end-stream", { roomCode, hostToken });
    setShowConfirm(false);
  }

  const handleExportAttendance = useCallback(() => {
    setExportingAttendance(true);
    const socket = getSocket();

    const timeout = setTimeout(() => {
      socket.off("attendance-list");
      setExportingAttendance(false);
    }, 10000);

    socket.once("attendance-list", (data: AttendeeRecord[]) => {
      clearTimeout(timeout);
      const header = "Name,Country,Joined At";
      const rows = data.map(
        (r) =>
          `${escapeCSV(r.username)},${escapeCSV(r.country || "")},${escapeCSV(r.joinedAt || "")}`
      );
      const csv = [header, ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      downloadCSV(`attendance-${roomCode}-${date}.csv`, csv);
      setExportingAttendance(false);
    });

    socket.emit("request-attendance", { roomCode, hostToken });
  }, [roomCode, hostToken]);

  const handleExportChat = useCallback(async () => {
    setExportingChat(true);
    try {
      const res = await fetch(`/api/comments?room=${roomCode}`);
      if (!res.ok) throw new Error("Failed to fetch chat");
      const messages: { username: string; text: string; timestamp: string }[] =
        await res.json();

      const header = "Username,Message,Timestamp";
      const rows = messages.map(
        (m) =>
          `${escapeCSV(m.username)},${escapeCSV(m.text)},${escapeCSV(m.timestamp || "")}`
      );
      const csv = [header, ...rows].join("\n");
      const date = new Date().toISOString().split("T")[0];
      downloadCSV(`chat-${roomCode}-${date}.csv`, csv);
    } catch (err) {
      console.error("Export chat failed:", err);
    } finally {
      setExportingChat(false);
    }
  }, [roomCode]);

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          You are the host
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleExportAttendance}
            disabled={exportingAttendance}
            className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-emerald-600/30 flex items-center gap-1.5 disabled:opacity-50"
            title="Export attendance as CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
              />
            </svg>
            {exportingAttendance ? "Exporting..." : "Attendance"}
          </button>

          <button
            onClick={handleExportChat}
            disabled={exportingChat}
            className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-amber-600/30 flex items-center gap-1.5 disabled:opacity-50"
            title="Export chat history as CSV"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
              />
            </svg>
            {exportingChat ? "Exporting..." : "Chat"}
          </button>

          <button
            onClick={() => setShowInvite(true)}
            className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border border-indigo-600/30"
          >
            Invite
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-400">End stream?</span>
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

      {showInvite && (
        <InviteModal
          roomCode={roomCode}
          hostToken={hostToken}
          onClose={() => setShowInvite(false)}
        />
      )}
    </>
  );
}
