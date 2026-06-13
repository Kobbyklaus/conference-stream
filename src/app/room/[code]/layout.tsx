import { LanguageProvider } from "@/lib/i18n";

// Scopes translations + RTL to the attendee-facing room pages only.
export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
