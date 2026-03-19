"use client";

function getEmbedUrl(url: string): string | null {
  const trimmed = url.trim();

  // YouTube - supports:
  // https://www.youtube.com/watch?v=ID
  // https://youtube.com/watch?v=ID&t=120
  // https://youtu.be/ID
  // https://www.youtube.com/embed/ID
  // https://www.youtube.com/shorts/ID
  // https://m.youtube.com/watch?v=ID
  // https://youtube.com/live/ID
  let match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;

  // Vimeo - supports:
  // https://vimeo.com/123456
  // https://player.vimeo.com/video/123456
  // https://vimeo.com/channels/xxx/123456
  match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/|channels\/[^/]+\/)?(\d+)/
  );
  if (match) return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;

  return null;
}

export default function VideoPlayer({ url }: { url: string }) {
  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-xl">
        <p className="text-gray-400">Unsupported video URL</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
