"use client";

import { useState } from "react";

interface InviteModalProps {
  roomCode: string;
  hostToken: string;
  onClose: () => void;
}

export default function InviteModal({ roomCode, hostToken, onClose }: InviteModalProps) {
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!emails.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomCode, hostToken, emails: emails.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send invitations");
      }

      const data = await res.json();
      setResult(data);
      if (data.sent > 0) {
        setEmails("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Invite Attendees</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email Addresses
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder={"Enter emails separated by commas or new lines\ne.g. john@email.com, jane@email.com"}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {result && (
            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              <p className="text-green-400">{result.sent} invitation(s) sent</p>
              {result.failed > 0 && (
                <p className="text-red-400">{result.failed} failed to send</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? "Sending..." : "Send Invitations"}
          </button>
        </form>
      </div>
    </div>
  );
}
