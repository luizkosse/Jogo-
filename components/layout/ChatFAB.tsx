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
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-sm bg-gold text-ink-shadow border-2 border-wood-dark shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_3px_0_var(--color-wood-dark)] transition-transform hover:scale-105 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <MessageCircle size={22} />
    </Link>
  );
}
