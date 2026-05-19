import Link from "next/link";

const links = [
  { href: "/macetes", label: "Macetes" },
  { href: "/bugs", label: "Bugs" },
  { href: "/missoes", label: "Missões" },
  { href: "/personagens", label: "Personagens" },
  { href: "/ids", label: "IDs" },
  { href: "/chat", label: "Assistente" },
];

export function Footer() {
  return (
    <footer className="mt-12 bg-paper-deep border-t-4 border-wood-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-display text-xl text-ink tracking-wide">
            Stardew Supremo
          </span>
          <nav className="flex flex-wrap justify-center gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-ink-soft">
          Conteúdo verificado contra{" "}
          <a
            href="https://stardewvalleywiki.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-water underline-offset-2 hover:underline"
          >
            stardewvalleywiki.com
          </a>
          . Não afiliado a ConcernedApe ou Chucklefish.
        </p>
      </div>
    </footer>
  );
}
