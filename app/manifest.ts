import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stardew Supremo",
    short_name: "Stardew Supremo",
    description: "Macetes, missões, bugs e segredos verificados de Stardew Valley.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0c20",
    theme_color: "#f4c430",
    orientation: "portrait",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    categories: ["games", "entertainment", "utilities"],
  };
}
