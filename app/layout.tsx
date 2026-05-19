import type { Metadata } from "next";
import { Inter, VT323, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatFAB } from "@/components/layout/ChatFAB";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stardew Supremo — Macetes, Missões e Segredos",
    template: "%s | Stardew Supremo",
  },
  description:
    "Macetes, missões, bugs e segredos de Stardew Valley em um só lugar. Busca fuzzy, IDs de itens e guia completo.",
  openGraph: {
    title: "Stardew Supremo",
    description:
      "Macetes, missões, bugs e segredos de Stardew Valley em um só lugar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${vt323.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatFAB />
          <GlobalSearch />
        </ToastProvider>
      </body>
    </html>
  );
}
