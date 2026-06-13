"use client";

import { useState, useEffect } from "react";
import CreateRoom from "@/components/CreateRoom";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function AttendanceModal({
  code,
  roomName,
  onClose,
}: {
  code: string;
  roomName: string;
  onClose: () => void;
}) {
  const [attendance, setAttendance] = useState<{ username: string; email: string; country: string; joinedAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
    fetch(`/api/admin/attendance/${code}`, { headers: { "x-admin-token": token } })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAttendance(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [code]);

  function handleExport() {
    const header = "Name,Email,Country,Joined At";
    const rows = attendance.map(
      (r) =>
        `${escapeCSV(r.username)},${escapeCSV(r.email || "")},${escapeCSV(r.country || "")},${escapeCSV(r.joinedAt || "")}`
    );
    const csv = [header, ...rows].join("\n");
    const date = new Date().toISOString().split("T")[0];
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${code}-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="surface rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Attendance List</h2>
            <p className="text-xs text-gray-500 mt-0.5">{roomName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              disabled={attendance.length === 0}
              className="px-4 py-1.5 text-xs font-medium bg-fuchsia-600/20 text-fuchsia-300 hover:bg-fuchsia-600/30 border border-fuchsia-500/30 rounded-lg transition-colors disabled:opacity-50"
            >
              Export CSV
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No attendance data recorded.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Country</th>
                  <th className="pb-3 font-medium">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {attendance.map((record, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 font-medium text-white">{record.username}</td>
                    <td className="py-3 text-gray-400">{record.email || "—"}</td>
                    <td className="py-3 text-gray-400">{record.country || "—"}</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(record.joinedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<"create" | "rooms" | "analytics" | "admins">("create");
  const [selectedAttendanceRoom, setSelectedAttendanceRoom] = useState<{code: string, name: string} | null>(null);
  const [admins, setAdmins] = useState<{ id: number; name: string; created_at: string }[]>([]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetch("/api/admin/analytics", { headers: adminHeaders() })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setStats(data);
        })
        .catch(console.error);
      loadAdmins();
    }
  }, [authenticated]);

  function adminHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
    return { "Content-Type": "application/json", "x-admin-token": token };
  }

  async function loadAdmins() {
    try {
      const res = await fetch("/api/admin/admins", { headers: adminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setAdmins(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdminMsg("");
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ name: newAdminName, password: newAdminPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAdminMsg(data.error || "Failed to add admin");
        return;
      }
      setNewAdminName("");
      setNewAdminPassword("");
      setAdminMsg(`Added ${data.name}`);
      loadAdmins();
    } catch {
      setAdminMsg("Something went wrong");
    }
  }

  async function handleDeleteAdmin(id: number) {
    if (!confirm("Remove this admin? They will no longer be able to sign in.")) return;
    try {
      await fetch(`/api/admin/admins?id=${id}`, { method: "DELETE", headers: adminHeaders() });
      loadAdmins();
    } catch (err) {
      console.error(err);
    }
  }

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

  async function handleForceEnd(code: string) {
    if (!confirm("Are you sure you want to forcibly end this room? It will be permanently removed from active rooms.")) return;
    
    try {
      const res = await fetch("/api/admin/rooms/end", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ code }),
      });
      
      if (!res.ok) throw new Error("Failed to end room");
      
      // Instantly update the UI local state
      setStats(prev => prev.map(r => r.code === code ? { ...r, status: "ended" } : r));
    } catch (err) {
      console.error(err);
      alert("Failed to end the room.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setAuthenticated(false);
    setPassword("");
  }

  // ─── Login Screen ─────────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Colourful accent glows */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo / Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30 mb-6 animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight heading-gradient">
              Conference Dashboard
            </h1>
            <p className="text-violet-200/70 mt-2 font-medium">
              190 Nations Office &middot; Admin Access
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="surface rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-field w-full rounded-xl px-4 py-3 text-sm"
                  required
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/30 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <a
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 mt-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // ─── Dashboard ─────────────────────────────────────────────
  const totalJoins = stats.reduce((sum, r) => sum + (r.total_joins || 0), 0);
  const totalComments = stats.reduce((sum, r) => sum + Number(r.total_comments || 0), 0);
  const peakViewers = stats.reduce((max, r) => Math.max(max, r.peak_viewers || 0), 0);
  const liveRooms = stats.filter((r) => r.status === "live").length;

  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0b0a1a]/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-white font-bold hidden sm:block">Conference Admin</span>
            </a>
            {liveRooms > 0 && (
              <span className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {liveRooms} Live
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back
          </h1>
          <p className="text-gray-500 mt-1">Manage your conferences and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Rooms</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.length}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Joins</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalJoins}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Peak</span>
            </div>
            <p className="text-3xl font-bold text-white">{peakViewers}</p>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Chats</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalComments}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-1 mb-8 w-fit">
          {[
            { key: "create" as const, label: "New Conference", icon: "M12 4.5v15m7.5-7.5h-15" },
            { key: "rooms" as const, label: "Active Rooms", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
            { key: "analytics" as const, label: "Analytics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
            { key: "admins" as const, label: "Admins", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "create" && (
          <div className="max-w-lg">
            <CreateRoom />
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-4">
            {stats.length === 0 ? (
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-1">No conferences yet</h3>
                <p className="text-gray-500 text-sm">Create your first conference to get started</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-sm"
                >
                  Create Conference
                </button>
              </div>
            ) : (
              stats.map((room) => (
                <div
                  key={room.code}
                  className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      room.status === "live"
                        ? "bg-green-500/10"
                        : room.status === "scheduled"
                        ? "bg-indigo-500/10"
                        : "bg-white/5"
                    }`}>
                      <svg className={`w-6 h-6 ${
                        room.status === "live" ? "text-green-400" : room.status === "scheduled" ? "text-fuchsia-300" : "text-gray-500"
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{room.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-mono text-gray-500">{room.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          room.status === "live"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : room.status === "scheduled"
                            ? "bg-indigo-500/10 text-fuchsia-300 border border-indigo-500/20"
                            : "bg-white/5 text-gray-500 border border-slate-700"
                        }`}>
                          {room.status}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(room.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center hidden sm:block">
                      <p className="text-white font-semibold">{room.total_joins}</p>
                      <p className="text-gray-600 text-xs">Joins</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="text-white font-semibold">{room.peak_viewers}</p>
                      <p className="text-gray-600 text-xs">Peak</p>
                    </div>
                    <div className="flex gap-2">
                      {(room.status === "live" || room.status === "scheduled") && (
                        <button
                          onClick={() => handleForceEnd(room.code)}
                          className="bg-red-900/40 hover:bg-red-800/60 text-red-400 px-4 py-2 rounded-xl text-xs font-medium transition-colors border border-red-800/50"
                        >
                          End Room
                        </button>
                      )}
                      <a
                        href={`/room/${room.code}`}
                        className="bg-white/5 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {stats.length === 0 ? (
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-gray-500">No data yet. Create and run conferences to see analytics.</p>
              </div>
            ) : (
              <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-semibold">Room Analytics</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{totalComments} total messages across all rooms</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-left border-b border-white/10">
                        <th className="px-6 py-3 font-medium">Room</th>
                        <th className="px-6 py-3 font-medium">Code</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Peak</th>
                        <th className="px-6 py-3 font-medium text-right">Joins</th>
                        <th className="px-6 py-3 font-medium text-right">Messages</th>
                        <th className="px-6 py-3 font-medium text-center">Attendance</th>
                        <th className="px-6 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((room) => (
                        <tr key={room.code} className="border-b border-white/10 hover:bg-white/[0.03] transition-colors">
                          <td className="px-6 py-4 font-medium text-white truncate max-w-[180px]">{room.name}</td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">{room.code}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              room.status === "live"
                                ? "bg-green-500/10 text-green-400"
                                : room.status === "scheduled"
                                ? "bg-indigo-500/10 text-fuchsia-300"
                                : "bg-white/5 text-gray-500"
                            }`}>
                              {room.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-white">{room.peak_viewers}</td>
                          <td className="px-6 py-4 text-right text-white">{room.total_joins}</td>
                          <td className="px-6 py-4 text-right text-white">{room.total_comments}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setSelectedAttendanceRoom({ code: room.code, name: room.name })}
                              className="text-xs bg-white/5 hover:bg-slate-700 text-gray-300 px-3 py-1.5 rounded disabled:opacity-50 transition-colors"
                            >
                              View List
                            </button>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(room.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "admins" && (
          <div className="max-w-lg space-y-6">
            {/* Add admin */}
            <form onSubmit={handleAddAdmin} className="surface rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Add an Admin</h2>
                <p className="text-sm text-violet-200/70 mt-0.5">
                  They will sign in at <span className="font-mono">/admin</span> with the password you set here.
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Pastor Maria"
                  className="input-field w-full rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="text"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field w-full rounded-lg px-3 py-2 text-sm"
                  minLength={6}
                  required
                />
              </div>
              {adminMsg && <p className="text-sm text-fuchsia-300">{adminMsg}</p>}
              <button type="submit" className="btn-primary w-full py-2.5 rounded-xl">
                Add Admin
              </button>
            </form>

            {/* Admin list */}
            <div className="surface rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="font-semibold">Admins</h2>
                <p className="text-xs text-gray-500 mt-0.5">The Owner (set by the server password) always has access.</p>
              </div>
              <div className="divide-y divide-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">O</span>
                    <div>
                      <p className="font-medium text-white">Owner</p>
                      <p className="text-xs text-gray-500">Server password</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">built-in</span>
                </div>
                {admins.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-violet-200 text-sm font-bold">
                        {a.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-white">{a.name}</p>
                        <p className="text-xs text-gray-500">Added {new Date(a.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(a.id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {admins.length === 0 && (
                  <p className="px-6 py-6 text-sm text-gray-500 text-center">No extra admins yet. Add one above.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedAttendanceRoom && (
        <AttendanceModal
          code={selectedAttendanceRoom.code}
          roomName={selectedAttendanceRoom.name}
          onClose={() => setSelectedAttendanceRoom(null)}
        />
      )}
    </main>
  );
}
