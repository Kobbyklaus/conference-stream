"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import ViewerCount from "@/components/ViewerCount";
import HostControls from "@/components/HostControls";
import ParticipantPanel from "@/components/ParticipantPanel";
import ReactionBar from "@/components/ReactionBar";
import ReactionOverlay from "@/components/ReactionOverlay";
import { getSocket, disconnectSocket } from "@/lib/socket";

interface Room {
  code: string;
  name: string;
  video_url: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  subtitle_url: string | null;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const userParam = searchParams.get("user");
  const hostTokenParam = searchParams.get("hostToken");

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(userParam || "");
  const [userCountry, setUserCountry] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [joined, setJoined] = useState(!!userParam);
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [roomStatus, setRoomStatus] = useState<string>("live");
  const [showParticipants, setShowParticipants] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [countdownParts, setCountdownParts] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [waitingCount, setWaitingCount] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  // Retrieve or store host token
  useEffect(() => {
    if (hostTokenParam) {
      // Store token and strip from URL
      localStorage.setItem(`host_${code}`, hostTokenParam);
      setHostToken(hostTokenParam);
      setIsHost(true);
      // Clean up URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("hostToken");
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      // Check localStorage
      const stored = localStorage.getItem(`host_${code}`);
      if (stored) {
        setHostToken(stored);
        setIsHost(true);
      }
    }
  }, [code, hostTokenParam]);

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

        // If user came with ?user= param, join immediately
        if (userParam) {
          const socket = getSocket();
          const storedToken = localStorage.getItem(`host_${code}`);
          socket.emit("join-room", {
            roomCode: code,
            username: userParam,
            country: "",
            hostToken: hostTokenParam || storedToken || undefined,
          });
        }
      })
      .catch(() => setError("Room not found. Check the code and try again."));

    return () => {
      disconnectSocket();
    };
  }, [code, userParam, hostTokenParam]);

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
        // Auto-start if host
        if (isHost && hostToken) {
          const socket = getSocket();
          socket.emit("host-start-stream", { roomCode: code, hostToken });
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
    socket.emit("join-room", {
      roomCode: code,
      username: username.trim(),
      country: userCountry,
      hostToken: hostToken || undefined,
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
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
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
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  if (!room) {
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
          <a href="/" className="text-indigo-400 hover:underline mt-4 inline-block">
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
        <form onSubmit={handleJoin} className="bg-gray-900 rounded-xl p-8 space-y-5 w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">{room.name}</h1>
            <p className="text-gray-400 text-sm">Enter your details to join the conference</p>
            {roomStatus === "scheduled" && countdown && (
              <p className="text-indigo-400 text-sm mt-2">
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
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Country</label>
            <select
              value={userCountry}
              onChange={(e) => setUserCountry(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
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
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              maxLength={1000}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors"
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
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
              &larr;
            </a>
            <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
          </div>
          <ViewerCount roomCode={code} />
        </header>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:flex-[3] p-4 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-lg mx-auto">
              {/* Conference name */}
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                {room.name}
              </h2>

              <p className="text-gray-400 text-sm uppercase tracking-widest">
                Starting Soon
              </p>

              {/* Flip-clock countdown */}
              {countdownParts && (
                <div className="flex items-center justify-center gap-3 md:gap-4">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px] shadow-lg shadow-amber-900/10">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
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
                    <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px] shadow-lg shadow-amber-900/10">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
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
                    <div className="bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[90px] shadow-lg shadow-amber-900/10">
                      <span className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
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
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
                <p className="text-sm text-gray-400">Share this conference</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono truncate">
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
          <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-gray-800 min-h-0">
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
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <a href="/" className="text-gray-400 hover:text-white text-sm shrink-0">
            &larr;
          </a>
          <h1 className="text-sm md:text-lg font-semibold truncate">{room.name}</h1>
          <span className="text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
            {room.code}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isHost && (
            <button
              onClick={() => setShowParticipants(true)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Participants
            </button>
          )}
          <ViewerCount roomCode={code} />
        </div>
      </header>

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
        <div className="flex-1 md:flex-initial md:w-[320px] lg:w-[350px] border-t md:border-t-0 md:border-l border-gray-800 min-h-0">
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
