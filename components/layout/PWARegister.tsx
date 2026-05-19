"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "sds:install-dismissed";

export function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      if (localStorage.getItem(DISMISSED_KEY) === "1") return;
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs wood-frame rounded-sm p-3">
      <button
        onClick={dismiss}
        className="absolute top-1.5 right-1.5 text-ink-soft hover:text-ink p-1"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>
      <p className="font-display text-lg text-ink mb-1 pr-6 leading-tight">Instalar Stardew Supremo?</p>
      <p className="text-xs text-ink-soft mb-3">
        Acesso offline aos macetes, missões e IDs direto da sua tela inicial.
      </p>
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-sm bg-gold text-ink-shadow border-2 border-wood-dark px-3 py-1.5 text-sm font-semibold shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_2px_0_var(--color-wood-dark)] hover:brightness-105 active:translate-y-px"
      >
        <Download size={13} /> Instalar
      </button>
    </div>
  );
}
