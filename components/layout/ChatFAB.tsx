"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function ChatFAB() {
  const pathname = usePathname();
  if (pathname === "/chat") return null;

  return (
    <Link
      href="/chat"
      aria-label="Abrir assistente"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold shadow-lg shadow-accent-gold/30 text-bg-deep transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
    >
      <MessageCircle size={24} />
    </Link>
  );
}
