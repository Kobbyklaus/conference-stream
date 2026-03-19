"use client";

import { useState, useEffect } from "react";
import CreateRoom from "@/components/CreateRoom";

interface RoomStats {
  code: string;
  name: string;
  status: string;
  peak_viewers: number;
  total_joins: number;
  total_comments: number;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<RoomStats[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated && showAnalytics) {
      fetch("/api/admin/analytics")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setStats(data);
        })
        .catch(console.error);
    }
  }, [authenticated, showAnalytics]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Invalid password");
      }

      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      setAuthenticated(true);
    } catch {
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setAuthenticated(false);
    setPassword("");
  }

  if (authenticated) {
    const totalJoins = stats.reduce((sum, r) => sum + (r.total_joins || 0), 0);
    const totalComments = stats.reduce((sum, r) => sum + Number(r.total_comments || 0), 0);
    const peakViewers = stats.reduce((max, r) => Math.max(max, r.peak_viewers || 0), 0);

    return (
      <main className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Create and manage conferences</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <CreateRoom />
          </div>

          {showAnalytics && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-indigo-400">{stats.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Rooms</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-400">{totalJoins}</p>
                  <p className="text-sm text-gray-400 mt-1">Total Joins</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-400">{peakViewers}</p>
                  <p className="text-sm text-gray-400 mt-1">Peak Viewers</p>
                </div>
              </div>

              {/* Room Stats Table */}
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-800">
                  <h2 className="font-semibold">Room Analytics</h2>
                  <p className="text-xs text-gray-500">{totalComments} total comments across all rooms</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-left border-b border-gray-800">
                        <th className="px-4 py-2">Room</th>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Peak</th>
                        <th className="px-4 py-2 text-right">Joins</th>
                        <th className="px-4 py-2 text-right">Comments</th>
                        <th className="px-4 py-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            No rooms created yet
                          </td>
                        </tr>
                      )}
                      {stats.map((room) => (
                        <tr key={room.code} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-2 font-medium truncate max-w-[150px]">{room.name}</td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-400">{room.code}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                room.status === "live"
                                  ? "bg-green-900/50 text-green-400"
                                  : room.status === "scheduled"
                                  ? "bg-indigo-900/50 text-indigo-400"
                                  : "bg-gray-800 text-gray-500"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">{room.peak_viewers}</td>
                          <td className="px-4 py-2 text-right">{room.total_joins}</td>
                          <td className="px-4 py-2 text-right">{room.total_comments}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">
                            {new Date(room.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <a
            href="/"
            className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-4 transition-colors"
          >
            &larr; Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter your password to host a conference
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-900 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-4 transition-colors"
        >
          &larr; Back to Home
        </a>
      </div>
    </main>
  );
}
