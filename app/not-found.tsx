import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="font-display text-8xl text-accent-gold mb-4">404</p>
      <h1 className="font-display text-3xl text-text-parchment mb-2">PÁGINA NÃO ENCONTRADA</h1>
      <p className="text-text-muted mb-8 max-w-md">
        Parece que você se perdeu na mina. Esta página não existe ou foi movida.
      </p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
