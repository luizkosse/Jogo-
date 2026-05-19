import Link from "next/link";
import { Sword } from "lucide-react";

const links = [
  { href: "/macetes", label: "Macetes" },
  { href: "/bugs", label: "Bugs" },
  { href: "/missoes", label: "Missões" },
  { href: "/ids", label: "IDs" },
  { href: "/chat", label: "Assistente" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-deep py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sword size={16} className="text-accent-gold" />
            <span className="font-display text-lg text-accent-gold">
              Stardew Supremo
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-text-muted hover:text-text-parchment transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-center text-xs text-text-dim">
          Conteúdo verificado contra{" "}
          <a
            href="https://stardewvalleywiki.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-water hover:underline"
          >
            stardewvalleywiki.com
          </a>
          . Não afiliado a ConcernedApe ou Chucklefish.
        </p>
      </div>
    </footer>
  );
}
