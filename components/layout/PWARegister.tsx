"use client";

import { useEffect } from "react";

/**
 * Registra o service worker em produção para suporte offline-first.
 * O prompt visual de instalação foi removido — o navegador segue exibindo
 * o ícone nativo de "instalar app" na barra de endereço quando aplicável.
 */
export function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
