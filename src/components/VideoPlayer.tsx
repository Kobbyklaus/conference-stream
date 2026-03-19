"use client";

import { useEffect, useRef, useCallback } from "react";
import { getSocket } from "@/lib/socket";

// Extend window for YouTube IFrame API
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideoPlayerProps {
  url: string;
  isHost: boolean;
  roomCode: string;
  hostToken?: string;
}

function parseVideoInfo(url: string): { provider: "youtube" | "vimeo"; id: string } | null {
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return { provider: "youtube", id: ytMatch[1] };

  // Vimeo
  const vimeoMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/|channels\/[^/]+\/)?(\d+)/
  );
  if (vimeoMatch) return { provider: "vimeo", id: vimeoMatch[1] };

  return null;
}

// Load YouTube IFrame API script once
let ytApiLoaded = false;
let ytApiReady = false;
const ytReadyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (ytApiReady) {
      resolve();
      return;
    }

    ytReadyCallbacks.push(resolve);

    if (!ytApiLoaded) {
      ytApiLoaded = true;
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        ytApiReady = true;
        ytReadyCallbacks.forEach((cb) => cb());
        ytReadyCallbacks.length = 0;
      };
    }
  });
}

export default function VideoPlayer({ url, isHost, roomCode, hostToken }: VideoPlayerProps) {
  const videoInfo = parseVideoInfo(url);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const syncTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingSyncRef = useRef<{ currentTime: number; isPlaying: boolean } | null>(null);
  const ignoreStateChangeRef = useRef(false);
  const lastSeekTimeRef = useRef(0);

  // Emit host events
  const emitHostEvent = useCallback(
    (event: string, currentTime: number) => {
      if (!isHost || !hostToken) return;
      const socket = getSocket();
      socket.emit(event, { roomCode, hostToken, currentTime });
    },
    [isHost, hostToken, roomCode]
  );

  useEffect(() => {
    if (!videoInfo || videoInfo.provider !== "youtube") return;

    let mounted = true;

    loadYouTubeAPI().then(() => {
      if (!mounted || !containerRef.current) return;

      // Create a div for the player
      const playerDiv = document.createElement("div");
      playerDiv.id = `yt-player-${roomCode}`;
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(playerDiv);

      playerRef.current = new window.YT.Player(playerDiv.id, {
        videoId: videoInfo.id,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: isHost ? 1 : 0,
          controls: isHost ? 1 : 0,
          disablekb: isHost ? 0 : 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            // Apply any pending sync (for ALL users including host on refresh)
            if (pendingSyncRef.current) {
              const { currentTime, isPlaying } = pendingSyncRef.current;
              ignoreStateChangeRef.current = true;
              playerRef.current?.seekTo(currentTime, true);
              if (isPlaying) {
                playerRef.current?.playVideo();
              } else {
                playerRef.current?.pauseVideo();
              }
              setTimeout(() => {
                ignoreStateChangeRef.current = false;
              }, 1000);
              pendingSyncRef.current = null;
            }

            // Host: start sync tick interval
            if (isHost && hostToken) {
              syncTickRef.current = setInterval(() => {
                if (playerRef.current) {
                  const socket = getSocket();
                  socket.emit("host-sync-tick", {
                    roomCode,
                    hostToken,
                    currentTime: playerRef.current.getCurrentTime(),
                    isPlaying:
                      playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING,
                  });
                }
              }, 5000);
            }
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (!isHost || ignoreStateChangeRef.current) return;

            const player = playerRef.current;
            if (!player) return;
            const currentTime = player.getCurrentTime();

            if (event.data === window.YT.PlayerState.PLAYING) {
              // Check if this is a seek (large jump from expected position)
              const timeSinceLastAction = (Date.now() - lastSeekTimeRef.current) / 1000;
              if (timeSinceLastAction > 1) {
                emitHostEvent("host-play", currentTime);
              }
              lastSeekTimeRef.current = Date.now();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              emitHostEvent("host-pause", currentTime);
              lastSeekTimeRef.current = Date.now();
            }
          },
        },
      });
    });

    // Listen for sync events (both host on refresh and viewers)
    const socket = getSocket();
    const initialSyncDoneRef = { current: false };

    const handleSync = ({ currentTime, isPlaying }: { currentTime: number; isPlaying: boolean }) => {
      const player = playerRef.current;
      if (!player || typeof player.seekTo !== "function") {
        // Player not ready yet, store for later
        pendingSyncRef.current = { currentTime, isPlaying };
        return;
      }

      // Host: only apply first sync (on refresh/rejoin), ignore subsequent ones
      if (isHost && initialSyncDoneRef.current) return;
      initialSyncDoneRef.current = true;

      // Only seek if drift is significant (> 2 seconds)
      const playerTime = player.getCurrentTime();
      if (Math.abs(playerTime - currentTime) > 2) {
        ignoreStateChangeRef.current = true;
        player.seekTo(currentTime, true);
        setTimeout(() => {
          ignoreStateChangeRef.current = false;
        }, 500);
      }

      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    };

    socket.on("sync-playback", handleSync);

    return () => {
      socket.off("sync-playback", handleSync);
      if (syncTickRef.current) clearInterval(syncTickRef.current);
      mounted = false;
    };
  }, [videoInfo?.id, isHost, roomCode, hostToken, emitHostEvent]);

  if (!videoInfo) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-xl">
        <p className="text-gray-400">Unsupported video URL</p>
      </div>
    );
  }

  // Vimeo fallback (no sync support)
  if (videoInfo.provider === "vimeo") {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${videoInfo.id}?autoplay=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // YouTube with IFrame API
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {/* Overlay to prevent viewer interaction with YouTube controls */}
      {!isHost && (
        <div className="absolute inset-0 z-10" style={{ pointerEvents: "auto" }} />
      )}
    </div>
  );
}
