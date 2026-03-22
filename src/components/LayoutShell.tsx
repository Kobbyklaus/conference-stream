"use client";

import { useState, useEffect } from "react";

export default function LayoutShell({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      setIsEmbedded(true); // cross-origin iframe
    }
  }, []);

  if (isEmbedded) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <div className="pt-16">{children}</div>
      {footer}
    </>
  );
}
