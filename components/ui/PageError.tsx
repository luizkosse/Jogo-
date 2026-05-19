"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export function PageError({ error, reset }: Props) {
  return (
    <div className="mx-auto max-w-md flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
      <p className="font-display text-5xl text-berry">ERRO</p>
      <div className="wood-frame rounded-sm p-4">
        <p className="text-ink">{error.message || "Algo deu errado ao carregar esta página."}</p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-sm bg-gold text-ink-shadow border-2 border-wood-dark px-4 py-2 text-sm font-semibold shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_2px_0_var(--color-wood-dark)] hover:brightness-105 active:translate-y-px"
      >
        Tentar novamente
      </button>
    </div>
  );
}
