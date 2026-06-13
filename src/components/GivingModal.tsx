"use client";

interface GivingRoom {
  name: string;
  paypal_url?: string | null;
  regional_label?: string | null;
  regional_url?: string | null;
}

export function hasGiving(room: GivingRoom | null | undefined): boolean {
  return !!(room && (room.paypal_url || room.regional_url));
}

export default function GivingModal({ room, onClose }: { room: GivingRoom; onClose: () => void }) {
  const options: { label: string; url: string; sub: string }[] = [];
  if (room.paypal_url) {
    options.push({ label: "Give with PayPal", url: room.paypal_url, sub: "Card or PayPal balance" });
  }
  if (room.regional_url) {
    options.push({ label: room.regional_label || "Local Giving", url: room.regional_url, sub: "Regional payment method" });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="surface rounded-2xl w-full max-w-sm p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-violet-500 shadow-lg shadow-fuchsia-500/30 mb-3">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold heading-gradient">Give an Offering</h2>
          <p className="text-violet-200/70 text-sm mt-1">Support {room.name}</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <a
              key={opt.url}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex flex-col items-center py-3 rounded-xl text-center"
            >
              <span className="font-semibold">{opt.label}</span>
              <span className="text-xs text-white/70">{opt.sub}</span>
            </a>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
