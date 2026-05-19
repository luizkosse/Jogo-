type TagColor = "grass" | "gold" | "water" | "danger" | "wood" | "muted";

export const catColor: Record<string, TagColor> = {
  dinheiro: "gold",
  itens: "water",
  energia: "grass",
  tempo: "muted",
  combate: "danger",
  fazenda: "grass",
};

export const catLabel: Record<string, string> = {
  dinheiro: "💰 Dinheiro",
  itens: "📦 Itens",
  energia: "⚡ Energia",
  tempo: "⏰ Tempo",
  combate: "⚔️ Combate",
  fazenda: "🌾 Fazenda",
};
