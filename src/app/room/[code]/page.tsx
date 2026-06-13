"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import ViewerCount from "@/components/ViewerCount";
import HostControls from "@/components/HostControls";
import ParticipantPanel from "@/components/ParticipantPanel";
import ReactionBar from "@/components/ReactionBar";
import ReactionOverlay from "@/components/ReactionOverlay";
import GivingModal, { hasGiving } from "@/components/GivingModal";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface Room {
  code: string;
  name: string;
  video_url: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  subtitle_url: string | null;
  paypal_url?: string | null;
  regional_label?: string | null;
  regional_url?: string | null;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const userParam = searchParams.get("user");
  // Lets a logged-in admin preview the exact attendee experience in the same
  // browser (?as=guest), without signing out.
  const previewAsGuest = searchParams.get("as") === "guest";

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(userParam || "");
  const [userEmail, setUserEmail] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [showGiving, setShowGiving] = useState(false);
  const [joined, setJoined] = useState(!!userParam);
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const joinEmittedRef = useRef(false);
  const [roomStatus, setRoomStatus] = useState<string>("live");
  const [showParticipants, setShowParticipants] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [reachedZero, setReachedZero] = useState(false);
  const [countdownParts, setCountdownParts] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [waitingCount, setWaitingCount] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  // Host authority comes ONLY from being a logged-in admin. We ask a
  // protected endpoint for the room's control token; attendees (not logged
  // into /admin) can never obtain it, so they can never control the stream.
  useEffect(() => {
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (previewAsGuest) {
      // Force the attendee experience for an admin testing in the same browser.
      setUsername((prev) => prev || "Preview");
      setJoined(true);
      setAuthChecked(true);
      return;
    }
    if (!adminToken) {
      setAuthChecked(true);
      return;
    }
    fetch(`/api/admin/rooms/${code}/token`, { headers: { "x-admin-token": adminToken } })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data?.hostToken) {
            setHostToken(data.hostToken);
            setIsHost(true);
            setUsername((prev) => prev || "Host");
            setJoined(true); // admins skip the attendee registration form
          }
        } else {
          // An admin token was present but the server rejected it (expired or
          // from a previous version). Clear it and tell them to sign in again
          // instead of silently demoting them to an attendee.
          localStorage.removeItem("admin_token");
          setSessionExpired(true);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, [code, previewAsGuest]);

  // Fetch room data on mount
  useEffect(() => {
    fetch(`/api/rooms?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      })
      .then((data) => {
        setRoom(data);
        setRoomStatus(data.status || "live");
      })
      .catch(() => setError("Room not found. Check the code and try again."));

    return () => {
      disconnectSocket();
    };
  }, [code]);

  // Join the socket room once both the room data and the admin check are ready.
  useEffect(() => {
    if (!room || !authChecked || joinEmittedRef.current) return;
    const socket = getSocket();
    if (isHost && hostToken) {
      joinEmittedRef.current = true;
      socket.emit("join-room", { roomCode: code, username: username || "Host", hostToken });
    } else if (userParam || previewAsGuest) {
      // Attendee arrived via a direct ?user= link or admin preview (no host privileges).
      joinEmittedRef.current = true;
      socket.emit("join-room", { roomCode: code, username: userParam || "Preview", country: "", email: "" });
    }
  }, [room, authChecked, isHost, hostToken, userParam, previewAsGuest, code, username]);

  // Listen for room lifecycle events
  useEffect(() => {
    const socket = getSocket();

    socket.on("room-ended", () => {
      setRoomStatus("ended");
    });

    socket.on("room-started", () => {
      setRoomStatus("live");
    });

    socket.on("you-were-kicked", () => {
      setKicked(true);
      disconnectSocket();
    });

    socket.on("viewer-count", (count: number) => {
      setWaitingCount(count);
    });

    return () => {
      socket.off("room-ended");
      socket.off("room-started");
      socket.off("you-were-kicked");
      socket.off("viewer-count");
    };
  }, []);

  // Countdown timer for scheduled rooms
  useEffect(() => {
    if (roomStatus !== "scheduled" || !room?.start_time) return;

    function updateCountdown() {
      const now = new Date();
      const start = new Date(room!.start_time!);
      const diff = start.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("");
        setCountdownParts({ hours: 0, minutes: 0, seconds: 0 });
        setReachedZero(true);
        const socket = getSocket();
        if (isHost && hostToken) {
          // Host's browser starts the stream the moment it's due.
          socket.emit("host-start-stream", { roomCode: code, hostToken });
        } else {
          // Attendees nudge the server to start it (server checks it's actually due).
          socket.emit("start-if-due", code);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownParts({ hours, minutes, seconds });

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [roomStatus, room?.start_time, isHost, hostToken, code]);

  const handleStartNow = useCallback(() => {
    if (!isHost || !hostToken) return;
    const socket = getSocket();
    socket.emit("host-start-stream", { roomCode: code, hostToken });
  }, [isHost, hostToken, code]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/room/${code}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [code]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    const socket = getSocket();
    joinEmittedRef.current = true;
    // Attendees never send a host token — only chat, reactions, giving, sharing.
    socket.emit("join-room", {
      roomCode: code,
      username: username.trim(),
      email: userEmail.trim(),
      country: userCountry,
    });
    if (prayerRequest.trim()) {
      socket.emit("send-prayer-request", {
        roomCode: code,
        username: username.trim(),
        country: userCountry,
        request: prayerRequest.trim(),
      });
    }
    setJoined(true);
  }

  // Kicked screen
  if (kicked) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Removed</h1>
          <p className="text-gray-400">You have been removed from this conference.</p>
          <a href="/" className="text-fuchsia-300 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // Error screen
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-gray-400">{error}</p>
          <a href="/" className="text-fuchsia-300 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  if (!room || !authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading conference...</p>
      </main>
    );
  }

  // Ended screen
  if (roomStatus === "ended") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-2">Conference Ended</h1>
          <p className="text-gray-500">{room.name} has ended.</p>
          <a href="/" className="text-fuchsia-300 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  // Show registration form if user arrived via direct link (no ?user= param)
  if (!joined) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <form onSubmit={handleJoin} className="surface rounded-2xl p-8 space-y-5 w-full max-w-md animate-scale-in">
          {sessionExpired && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 px-4 py-3 text-sm text-amber-100">
              Your admin session expired. To host this conference,{" "}
              <a href="/admin" className="font-semibold underline hover:text-white">sign in again</a>.
            </div>
          )}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-1 heading-gradient">{room.name}</h1>
            <p className="text-violet-200/70 text-sm">Enter your details to join the conference</p>
            {roomStatus === "scheduled" && countdown && (
              <p className="text-fuchsia-300 text-sm mt-2 font-semibold">
                Starts in {countdown}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Your Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your display name"
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field w-full rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Country</label>
            <select
              value={userCountry}
              onChange={(e) => setUserCountry(e.target.value)}
              className="input-field w-full rounded-lg px-3 py-2 text-sm appearance-none"
            >
              <option value="">Select your country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Angola">Angola</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Congo (Brazzaville)">Congo (Brazzaville)</option>
              <option value="Congo (Kinshasa)">Congo (Kinshasa)</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Ivory Coast">Ivory Coast</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Mali">Mali</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Moldova">Moldova</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="North Korea">North Korea</option>
              <option value="North Macedonia">North Macedonia</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Korea">South Korea</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Togo">Togo</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Prayer Request <span className="text-gray-600">(optional)</span></label>
            <textarea
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              placeholder="Share a prayer request (optional)..."
              className="input-field w-full rounded-lg px-3 py-2 text-sm resize-none"
              rows={3}
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-2.5 rounded-xl"
          >
            Join Conference
          </button>
        </form>
      </main>
    );
  }

  // Scheduled / waiting screen
  if (roomStatus === "scheduled") {
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
      <main className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
              &larr;
            </a>
            <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
            {isHost && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30">
                ★ HOST
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isHost && (
              <a
                href={`/room/${code}?as=guest`}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                title="See exactly what attendees see"
              >
                👁 Preview
              </a>
            )}
            {hasGiving(room) && (
              <button
                onClick={() => setShowGiving(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-fuchsia-500/20 hover:from-amber-500/30 hover:to-fuchsia-500/30 border border-fuchsia-400/30 text-amber-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                ❤ Give
              </button>
            )}
            <ViewerCount roomCode={code} />
          </div>
        </header>

        {previewAsGuest && (
          <div className="bg-amber-500/15 border-b border-amber-400/30 text-amber-100 text-sm px-4 py-2 text-center">
            👁 Previewing as an attendee — this is exactly what they see.{" "}
            <a href={`/room/${code}`} className="font-semibold underline hover:text-white">Exit preview</a>
          </div>
        )}

        {showGiving && room && <GivingModal room={room} onClose={() => setShowGiving(false)} />}

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:flex-[3] p-4 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-lg mx-auto">
              {/* Conference name */}
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight heading-gradient">
                {room.name}
              </h2>

              <p className="text-violet-200/70 text-sm uppercase tracking-[0.3em] font-semibold">
                {reachedZero ? (
                  <span className="inline-flex items-center gap-2 text-fuchsia-300">
                    <span className="w-3 h-3 border-2 border-fuchsia-300 border-t-transparent rounded-full animate-spin" />
                    Starting now…
                  </span>
                ) : (
                  "Starting Soon"
                )}
              </p>

              {/* Flip-clock countdown */}
              {countdownParts && (
                <div className="flex items-center justify-center gap-3 md:gap-4">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="surface rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px]">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-violet-200 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                        {pad(countdownParts.hours)}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 mt-1.5 uppercase tracking-wider">
                      Hours
                    </span>
                  </div>

                  <span className="text-2xl md:text-3xl text-amber-500/60 font-bold mt-[-16px]">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <div className="surface rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px]">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-violet-200 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                        {pad(countdownParts.minutes)}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 mt-1.5 uppercase tracking-wider">
                      Minutes
                    </span>
                  </div>

                  <span className="text-2xl md:text-3xl text-amber-500/60 font-bold mt-[-16px]">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <div className="surface rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px]">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-violet-200 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                        {pad(countdownParts.seconds)}
                      </span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 mt-1.5 uppercase tracking-wider">
                      Seconds
                    </span>
                  </div>
                </div>
              )}

              {room.start_time && (
                <p className="text-gray-400 text-sm">
                  Scheduled for{" "}
                  <span className="text-gray-300 font-medium">
                    {new Date(room.start_time).toLocaleString()}
                  </span>
                </p>
              )}

              {/* People waiting */}
              {waitingCount > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  <span>
                    <span className="text-amber-400 font-semibold">{waitingCount}</span>{" "}
                    {waitingCount === 1 ? "person" : "people"} waiting
                  </span>
                </div>
              )}

              {/* Share section */}
              <div className="surface rounded-2xl p-4 space-y-3">
                <p className="text-sm text-violet-200/70">Share this conference</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono truncate">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/room/${code}`
                      : `/room/${code}`}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      linkCopied
                        ? "bg-green-600/30 text-green-400 border border-green-600/30"
                        : "bg-amber-600/20 hover:bg-amber-600/40 text-amber-400 border border-amber-600/30"
                    }`}
                  >
                    {linkCopied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Host start button */}
              {isHost && (
                <button
                  onClick={handleStartNow}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-medium transition-colors text-lg shadow-lg shadow-green-900/30"
                >
                  Start Now
                </button>
              )}
            </div>
          </div>

          {/* Chat available during waiting */}
          <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-white/10 min-h-0">
            <ChatPanel roomCode={code} username={username || "Anonymous"} isHost={isHost} />
          </div>
        </div>
      </main>
    );
  }

  // Live room
  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
            &larr;
          </a>
          <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
          <span className="text-xs text-violet-200/80 font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
            {room.code}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-violet-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            {linkCopied ? "Copied!" : "Share"}
          </button>
          {hasGiving(room) && (
            <button
              onClick={() => setShowGiving(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-fuchsia-500/20 hover:from-amber-500/30 hover:to-fuchsia-500/30 border border-fuchsia-400/30 text-amber-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              ❤ Give
            </button>
          )}
          {isHost && (
            <a
              href={`/room/${code}?as=guest`}
              className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-violet-100 px-3 py-1.5 rounded-lg transition-colors"
              title="See exactly what attendees see"
            >
              👁 Preview
            </a>
          )}
          {isHost && (
            <button
              onClick={() => setShowParticipants(true)}
              className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-violet-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Participants
            </button>
          )}
          <ViewerCount roomCode={code} />
        </div>
      </header>

      {previewAsGuest && (
        <div className="bg-amber-500/15 border-b border-amber-400/30 text-amber-100 text-sm px-4 py-2 text-center">
          👁 Previewing as an attendee — this is exactly what they see.{" "}
          <a href={`/room/${code}`} className="font-semibold underline hover:text-white">Exit preview</a>
        </div>
      )}

      {showGiving && room && <GivingModal room={room} onClose={() => setShowGiving(false)} />}

      {/* Content - stacks vertically on mobile, side by side on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Video area + host controls */}
        <div className="w-full md:flex-[3] flex flex-col min-w-0">
          <div className="flex-1 p-2 md:p-4 flex items-start md:items-center justify-center">
            <div className="w-full relative">
              <ReactionOverlay roomCode={code} />
              <VideoPlayer
                url={room.video_url}
                isHost={isHost}
                roomCode={code}
                hostToken={hostToken || undefined}
                subtitleUrl={room.subtitle_url || undefined}
              />
            </div>
          </div>
          <ReactionBar roomCode={code} />
          {isHost && hostToken && (
            <HostControls roomCode={code} hostToken={hostToken} />
          )}
        </div>

        {/* Chat - below video on mobile, sidebar on desktop */}
        <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-white/10 min-h-0">
          <ChatPanel roomCode={code} username={username || "Anonymous"} isHost={isHost} />
        </div>
      </div>

      {/* Participant panel modal */}
      {showParticipants && (
        <ParticipantPanel
          roomCode={code}
          hostToken={hostToken || undefined}
          isHost={isHost}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {/* End time warning */}
      {room.end_time && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          Ends: {new Date(room.end_time).toLocaleString()}
        </div>
      )}
    </main>
  );
}
