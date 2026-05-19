"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sword, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/macetes", label: "Macetes" },
  { href: "/bugs", label: "Bugs" },
  { href: "/missoes", label: "Missões" },
  { href: "/ids", label: "IDs" },
  { href: "/chat", label: "Assistente" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg-deep/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sword size={20} className="text-accent-gold" />
          <span className="font-display text-xl text-accent-gold tracking-wide">
            Stardew Supremo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === l.href
                  ? "bg-accent-gold/15 text-accent-gold"
                  : "text-text-muted hover:text-text-parchment hover:bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const e = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              document.dispatchEvent(e);
            }}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-bg-twilight px-3 py-1.5 text-sm text-text-muted hover:border-accent-gold/30 hover:text-text-parchment transition-colors"
          >
            <Search size={14} />
            <span>Buscar</span>
            <kbd className="rounded bg-white/10 px-1 py-0.5 text-xs">⌘K</kbd>
          </button>

          <button
            className="md:hidden p-2 text-text-muted hover:text-text-parchment"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-bg-deep px-4 py-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                pathname === l.href
                  ? "bg-accent-gold/15 text-accent-gold"
                  : "text-text-muted hover:text-text-parchment hover:bg-white/5"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
