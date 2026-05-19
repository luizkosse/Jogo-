import type { Metadata, Viewport } from "next";
import { Inter, VT323, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatFAB } from "@/components/layout/ChatFAB";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { PWARegister } from "@/components/layout/PWARegister";
import { SearchModalProvider } from "@/lib/use-search-modal";

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
  appleWebApp: {
    capable: true,
    title: "Stardew Supremo",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#a76e3b",
  width: "device-width",
  initialScale: 1,
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
          <SearchModalProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatFAB />
            <GlobalSearch />
            <PWARegister />
          </SearchModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
