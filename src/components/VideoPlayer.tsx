"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getSocket } from "@/lib/socket";

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
  subtitleUrl?: string;
}

type VideoInfo =
  | { provider: "youtube"; id: string }
  | { provider: "vimeo"; id: string }
  | { provider: "googledrive"; id: string }
  | { provider: "direct"; url: string };

function parseVideoInfo(url: string): VideoInfo | null {
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

  // Google Drive
  const driveMatch = trimmed.match(
    /(?:https?:\/\/)?drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) return { provider: "googledrive", id: driveMatch[1] };

  // Direct video URL
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { provider: "direct", url: trimmed };
  }

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

export default function VideoPlayer({ url, isHost, roomCode, hostToken, subtitleUrl }: VideoPlayerProps) {
  const videoInfo = parseVideoInfo(url);
  const playerRef = useRef<YT.Player | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const syncTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingSyncRef = useRef<{ currentTime: number; isPlaying: boolean } | null>(null);
  const ignoreStateChangeRef = useRef(false);
  const lastSeekTimeRef = useRef(0);
  const [captionsOn, setCaptionsOn] = useState(true);

  const emitHostEvent = useCallback(
    (event: string, currentTime: number) => {
      if (!isHost || !hostToken) return;
      const socket = getSocket();
      socket.emit(event, { roomCode, hostToken, currentTime });
    },
    [isHost, hostToken, roomCode]
  );

  // YouTube effect
  useEffect(() => {
    if (!videoInfo || videoInfo.provider !== "youtube") return;

    let mounted = true;

    loadYouTubeAPI().then(() => {
      if (!mounted || !containerRef.current) return;

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
          cc_load_policy: 1,
        },
        events: {
          onReady: () => {
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

    const socket = getSocket();
    const initialSyncDoneRef = { current: false };

    const handleSync = ({ currentTime, isPlaying }: { currentTime: number; isPlaying: boolean }) => {
      const player = playerRef.current;
      if (!player || typeof player.seekTo !== "function") {
        pendingSyncRef.current = { currentTime, isPlaying };
        return;
      }
      if (isHost && initialSyncDoneRef.current) return;
      initialSyncDoneRef.current = true;

      const playerTime = player.getCurrentTime();
      if (Math.abs(playerTime - currentTime) > 2) {
        ignoreStateChangeRef.current = true;
        player.seekTo(currentTime, true);
        setTimeout(() => {
          ignoreStateChangeRef.current = false;
        }, 500);
      }
      if (isPlaying) player.playVideo();
      else player.pauseVideo();
    };

    socket.on("sync-playback", handleSync);

    return () => {
      socket.off("sync-playback", handleSync);
      if (syncTickRef.current) clearInterval(syncTickRef.current);
      mounted = false;
    };
  }, [videoInfo?.provider === "youtube" ? (videoInfo as { id: string }).id : null, isHost, roomCode, hostToken, emitHostEvent]);

  // Direct video (HTML5 <video>) sync effect
  useEffect(() => {
    if (!videoInfo || videoInfo.provider !== "direct") return;

    const video = videoRef.current;
    if (!video) return;

    // Host: emit play/pause/seek events
    const handlePlay = () => {
      if (!isHost || ignoreStateChangeRef.current) return;
      emitHostEvent("host-play", video.currentTime);
    };

    const handlePause = () => {
      if (!isHost || ignoreStateChangeRef.current) return;
      emitHostEvent("host-pause", video.currentTime);
    };

    const handleSeeked = () => {
      if (!isHost || ignoreStateChangeRef.current) return;
      emitHostEvent("host-seek", video.currentTime);
    };

    if (isHost) {
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("seeked", handleSeeked);

      // Start sync tick
      syncTickRef.current = setInterval(() => {
        if (hostToken) {
          const socket = getSocket();
          socket.emit("host-sync-tick", {
            roomCode,
            hostToken,
            currentTime: video.currentTime,
            isPlaying: !video.paused,
          });
        }
      }, 5000);
    }

    // Listen for sync events
    const socket = getSocket();
    const initialSyncDoneRef = { current: false };

    const handleSync = ({ currentTime, isPlaying }: { currentTime: number; isPlaying: boolean }) => {
      if (isHost && initialSyncDoneRef.current) return;
      initialSyncDoneRef.current = true;

      if (Math.abs(video.currentTime - currentTime) > 2) {
        ignoreStateChangeRef.current = true;
        video.currentTime = currentTime;
        setTimeout(() => {
          ignoreStateChangeRef.current = false;
        }, 500);
      }
      if (isPlaying && video.paused) video.play();
      else if (!isPlaying && !video.paused) video.pause();
    };

    socket.on("sync-playback", handleSync);

    // Apply pending sync
    if (pendingSyncRef.current) {
      handleSync(pendingSyncRef.current);
      pendingSyncRef.current = null;
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeked", handleSeeked);
      socket.off("sync-playback", handleSync);
      if (syncTickRef.current) clearInterval(syncTickRef.current);
    };
  }, [videoInfo?.provider === "direct" ? (videoInfo as { url: string }).url : null, isHost, roomCode, hostToken, emitHostEvent]);

  if (!videoInfo) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-xl p-8">
        <p className="text-gray-400">Unsupported video URL</p>
      </div>
    );
  }

  // Vimeo
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

  // Google Drive
  if (videoInfo.provider === "googledrive") {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={`https://drive.google.com/file/d/${videoInfo.id}/preview`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        {!isHost && (
          <div className="absolute inset-0 z-10" style={{ pointerEvents: "auto" }} />
        )}
      </div>
    );
  }

  // Direct video (MP4, WebM, etc.)
  if (videoInfo.provider === "direct") {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          controls={isHost}
          autoPlay={isHost}
          playsInline
        >
          <source src={videoInfo.url} />
          {subtitleUrl && (
            <track
              kind="subtitles"
              src={subtitleUrl}
              srcLang="en"
              label="English"
              default={captionsOn}
            />
          )}
        </video>
        {/* CC toggle for direct videos with subtitles */}
        {subtitleUrl && (
          <button
            onClick={() => {
              setCaptionsOn(!captionsOn);
              const video = videoRef.current;
              if (video && video.textTracks[0]) {
                video.textTracks[0].mode = captionsOn ? "hidden" : "showing";
              }
            }}
            className={`absolute bottom-3 right-3 z-20 px-2 py-1 rounded text-xs font-bold transition-colors ${
              captionsOn
                ? "bg-white text-black"
                : "bg-gray-800/80 text-gray-400"
            }`}
          >
            CC
          </button>
        )}
        {!isHost && (
          <div className="absolute inset-0 z-10" style={{ pointerEvents: "auto" }} />
        )}
      </div>
    );
  }

  // YouTube with IFrame API
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      {!isHost && (
        <div className="absolute inset-0 z-10" style={{ pointerEvents: "auto" }} />
      )}
    </div>
  );
}
