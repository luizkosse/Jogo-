"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchModal } from "@/lib/use-search-modal";

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
  const { setOpen: openSearch } = useSearchModal();
  const triggerSearch = () => openSearch(true);

  return (
    <header className="sticky top-0 z-40 bg-wood border-b-4 border-wood-dark shadow-[0_3px_0_var(--color-wood-dark)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl sm:text-2xl tracking-wide text-paper-soft drop-shadow-[1px_1px_0_var(--color-ink-shadow)]">
            Stardew Supremo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 text-sm font-semibold border-2 transition-all rounded-sm",
                  active
                    ? "bg-gold text-ink-shadow border-wood-dark shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                    : "border-transparent text-paper-soft [@media(hover:hover)]:hover:bg-wood-light [@media(hover:hover)]:hover:border-wood-dark"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerSearch}
            className="hidden sm:flex items-center gap-2 h-9 px-3 text-sm bg-paper-soft text-ink-soft border-2 border-wood-dark rounded-sm shadow-[inset_0_0_0_2px_var(--color-wood-light)] hover:text-ink hover:shadow-[inset_0_0_0_2px_var(--color-gold)] transition-shadow"
            aria-label="Buscar"
          >
            <Search size={14} />
            <span>buscar</span>
            <kbd className="font-mono text-[10px] bg-paper-deep border border-wood-dark rounded px-1 ml-1">⌘K</kbd>
          </button>

          <button
            onClick={triggerSearch}
            className="sm:hidden h-10 w-10 inline-flex items-center justify-center bg-paper-soft text-ink-soft border-2 border-wood-dark rounded-sm"
            aria-label="Buscar"
          >
            <Search size={16} />
          </button>

          <button
            className="md:hidden h-10 w-10 inline-flex items-center justify-center bg-paper-soft text-ink border-2 border-wood-dark rounded-sm"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-wood-light border-t-2 border-wood-dark px-3 py-2 flex flex-col gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-base font-semibold rounded-sm border-2 transition-colors",
                  active
                    ? "bg-gold text-ink-shadow border-wood-dark"
                    : "border-transparent text-paper-soft [@media(hover:hover)]:hover:bg-wood"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
