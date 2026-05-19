/**
 * Mini-mapa de Stardew Valley em estilo pixel-art top-down (tilemap).
 * Layout abstrato baseado na geografia do jogo:
 *   - Fazenda (NO), Mountain+Mines (NE)
 *   - Backwoods (N), Pelican Town (centro)
 *   - Cindersap Forest + Wizard Tower (SO), Secret Woods (O extremo)
 *   - The Beach (S), Bus Stop (E), Calico Desert (E inset), Skull Cavern (no deserto)
 *   - Ginger Island (SE inset)
 */

interface Region {
  id: string;
  name: string;
  keywords: string[];
  /** retângulo no viewBox 640x420 */
  x: number; y: number; w: number; h: number;
  /** ponto âncora do pin (default: centro do rect) */
  pinX?: number; pinY?: number;
  /** posição do label (default: centro do rect) */
  labelX?: number; labelY?: number;
}

const REGIONS: Region[] = [
  { id: "farm",         name: "Fazenda",         keywords: ["farm", "fazenda"],                                 x: 30,  y: 30,  w: 140, h: 110 },
  { id: "backwoods",    name: "Backwoods",       keywords: ["backwoods"],                                       x: 180, y: 30,  w: 170, h: 70  },
  { id: "mountain",     name: "Montanha",        keywords: ["mountain", "montanha", "robin", "linus", "demetrius"], x: 360, y: 30,  w: 250, h: 100 },
  { id: "mines",        name: "Mina",            keywords: ["mine", "mines", "mina", "minas"],                  x: 510, y: 50,  w: 80,  h: 60  },
  { id: "town",         name: "Pelican Town",    keywords: ["pelican", "town", "vila", "cidade", "lewis", "mayor"], x: 200, y: 160, w: 240, h: 110 },
  { id: "forest",       name: "Cindersap Forest",keywords: ["cindersap", "forest", "floresta", "marnie", "wizard", "leah"], x: 30,  y: 150, w: 150, h: 180 },
  { id: "secret-woods", name: "Secret Woods",    keywords: ["secret woods", "bosque", "secreto"],               x: 30,  y: 340, w: 120, h: 60  },
  { id: "beach",        name: "Praia",           keywords: ["beach", "praia", "willy"],                         x: 200, y: 280, w: 240, h: 120 },
  { id: "bus",          name: "Bus Stop",        keywords: ["bus", "ônibus", "onibus", "pam"],                  x: 450, y: 160, w: 80,  h: 50  },
  { id: "desert",       name: "Deserto",         keywords: ["desert", "deserto", "calico", "sandy"],            x: 540, y: 150, w: 70,  h: 90  },
  { id: "skull",        name: "Skull Cavern",    keywords: ["skull", "caverna", "caveira"],                     x: 540, y: 250, w: 70,  h: 50  },
  { id: "island",       name: "Ginger Island",   keywords: ["ginger", "island", "ilha"],                        x: 460, y: 310, w: 150, h: 90  },
  { id: "swamp",        name: "Witch's Swamp",   keywords: ["witch", "swamp", "bruxa"],                         x: 30,  y: 410, w: 80,  h: 0   },
];

function findRegion(location: string | null | undefined): Region | null {
  if (!location) return null;
  const loc = location.toLowerCase();
  for (const r of REGIONS) {
    if (r.keywords.some((k) => loc.includes(k))) return r;
  }
  return null;
}

interface Props {
  location: string | null | undefined;
  className?: string;
}

export function StardewMap({ location, className = "" }: Props) {
  const highlight = findRegion(location);

  return (
    <div className={`wood-frame rounded-sm overflow-hidden ${className}`}>
      <div className="px-3 py-2 bg-wood text-paper-soft border-b-2 border-wood-dark flex items-center justify-between">
        <span className="font-display text-lg tracking-wide">MAPA DO VALE</span>
        {highlight && (
          <span className="text-xs font-bold uppercase tracking-wide text-gold-soft">📍 {highlight.name}</span>
        )}
      </div>

      <svg viewBox="0 0 640 420" className="w-full h-auto block" role="img" aria-labelledby="sds-map-title sds-map-desc" style={{ imageRendering: "pixelated" }}>
        <title id="sds-map-title">{highlight ? `Mapa do vale — destaque em ${highlight.name}` : "Mapa do vale de Stardew Valley"}</title>
        <desc id="sds-map-desc">Mapa pixel-art top-down do vale com 12 regiões. {highlight ? `Marcador em ${highlight.name}.` : ""}</desc>
        <defs>
          {/* Padrões de tile estilo pixel */}
          <pattern id="p-grass" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#7bb53f" />
            <rect x="0" y="0" width="2" height="2" fill="#5a9b2c" />
            <rect x="4" y="4" width="2" height="2" fill="#5a9b2c" />
          </pattern>
          <pattern id="p-water" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#4f8fb3" />
            <rect x="0" y="0" width="3" height="2" fill="#3a7195" />
            <rect x="5" y="5" width="3" height="2" fill="#3a7195" />
          </pattern>
          <pattern id="p-sand" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#e8d29a" />
            <rect x="0" y="0" width="1" height="1" fill="#c4a86a" />
            <rect x="3" y="3" width="1" height="1" fill="#c4a86a" />
          </pattern>
          <pattern id="p-dirt" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#a76e3b" />
            <rect x="0" y="0" width="1" height="1" fill="#7a4e26" />
            <rect x="3" y="3" width="1" height="1" fill="#c79360" />
          </pattern>
          <pattern id="p-cobble" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#9aa39b" />
            <rect x="0" y="0" width="2" height="2" fill="#7f8a82" />
            <rect x="3" y="3" width="2" height="2" fill="#bcc4be" />
          </pattern>
          <pattern id="p-stone" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#5a5450" />
            <rect x="0" y="0" width="2" height="2" fill="#3e3a37" />
            <rect x="3" y="3" width="2" height="2" fill="#7a7470" />
          </pattern>
          <pattern id="p-deepforest" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#3d6b1c" />
            <rect x="0" y="0" width="2" height="2" fill="#2a4f12" />
            <rect x="4" y="4" width="2" height="2" fill="#5a9b2c" />
          </pattern>
        </defs>

        {/* Oceano de fundo */}
        <rect x="0" y="0" width="640" height="420" fill="url(#p-water)" />

        {/* Regiões (tiles) */}
        {REGIONS.filter((r) => r.h > 0).map((r) => {
          const isHighlight = highlight?.id === r.id;
          const dim = highlight && !isHighlight;
          let fill = "url(#p-grass)";
          if (r.id === "mines" || r.id === "skull") fill = "url(#p-stone)";
          else if (r.id === "desert") fill = "url(#p-sand)";
          else if (r.id === "beach") fill = "url(#p-sand)";
          else if (r.id === "mountain") fill = "url(#p-stone)";
          else if (r.id === "bus") fill = "url(#p-cobble)";
          else if (r.id === "town") fill = "url(#p-cobble)";
          else if (r.id === "secret-woods") fill = "url(#p-deepforest)";
          else if (r.id === "island") fill = "url(#p-grass)";
          else if (r.id === "farm") fill = "url(#p-dirt)";

          return (
            <g key={r.id} opacity={dim ? 0.45 : 1}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={fill} />
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="#2b1a0c" strokeWidth={isHighlight ? 3 : 2} />
              {isHighlight && (
                <rect x={r.x - 2} y={r.y - 2} width={r.w + 4} height={r.h + 4} fill="none" stroke="#e9a72c" strokeWidth="2" strokeDasharray="4 2" />
              )}
            </g>
          );
        })}

        {/* Rio (passa pelo lado leste da fazenda → vila → praia) */}
        <path d="M 170 30 L 170 100 Q 170 140 200 160 L 200 270 L 200 400" stroke="url(#p-water)" strokeWidth="10" fill="none" />
        <path d="M 170 30 L 170 100 Q 170 140 200 160 L 200 270 L 200 400" stroke="#2b1a0c" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Ponte sobre rio entrando na vila */}
        <rect x="186" y="155" width="28" height="10" fill="url(#p-dirt)" stroke="#2b1a0c" strokeWidth="1.5" />

        {/* Estradas de terra */}
        <rect x="320" y="155" width="10" height="125" fill="url(#p-dirt)" />
        <rect x="320" y="155" width="10" height="125" fill="none" stroke="#2b1a0c" strokeWidth="1" opacity="0.4" />

        {/* Detalhes — Fazenda: tufos de planta */}
        {[[50, 60], [80, 90], [110, 60], [140, 95]].map(([cx, cy], i) => (
          <g key={`farm-${i}`}>
            <rect x={cx} y={cy} width="6" height="6" fill="#7bb53f" />
            <rect x={cx + 1} y={cy + 1} width="4" height="4" fill="#5a9b2c" />
          </g>
        ))}
        {/* Casinha da fazenda */}
        <g>
          <rect x="60" y="40" width="22" height="18" fill="#c4453a" stroke="#2b1a0c" strokeWidth="1.5" />
          <polygon points="58,40 84,40 71,30" fill="#7a4e26" stroke="#2b1a0c" strokeWidth="1.5" />
          <rect x="68" y="48" width="6" height="10" fill="#2b1a0c" />
        </g>

        {/* Detalhes — Vila: prédios */}
        {[
          { x: 215, y: 175, w: 26, h: 22, roof: "#5b3a1f" },
          { x: 250, y: 185, w: 30, h: 30, roof: "#c4453a" },
          { x: 290, y: 175, w: 22, h: 22, roof: "#4f8fb3" },
          { x: 345, y: 200, w: 28, h: 24, roof: "#7a4e26" },
          { x: 380, y: 180, w: 26, h: 26, roof: "#c4453a" },
          { x: 215, y: 230, w: 30, h: 20, roof: "#5b3a1f" },
          { x: 260, y: 230, w: 30, h: 24, roof: "#4f8fb3" },
        ].map((b, i) => (
          <g key={`b-${i}`}>
            <rect x={b.x} y={b.y + 6} width={b.w} height={b.h - 6} fill="#e7cf9b" stroke="#2b1a0c" strokeWidth="1" />
            <polygon points={`${b.x - 1},${b.y + 6} ${b.x + b.w + 1},${b.y + 6} ${b.x + b.w / 2},${b.y}`} fill={b.roof} stroke="#2b1a0c" strokeWidth="1" />
          </g>
        ))}

        {/* Detalhes — Floresta: árvores pixel */}
        {[
          [50, 200], [85, 240], [55, 280], [115, 210], [120, 290],
          [75, 320], [120, 250], [50, 250],
        ].map(([cx, cy], i) => (
          <g key={`tree-${i}`}>
            <rect x={(cx as number) - 2} y={(cy as number) + 8} width="4" height="6" fill="#5b3a1f" />
            <rect x={(cx as number) - 8} y={(cy as number) - 8} width="16" height="16" fill="#3d6b1c" stroke="#2b1a0c" strokeWidth="1" />
            <rect x={(cx as number) - 6} y={(cy as number) - 6} width="4" height="4" fill="#5a9b2c" />
          </g>
        ))}
        {/* Wizard tower */}
        <g>
          <rect x="142" y="295" width="14" height="22" fill="#4f8fb3" stroke="#2b1a0c" strokeWidth="1" />
          <polygon points="140,295 158,295 149,283" fill="#5b3a1f" stroke="#2b1a0c" strokeWidth="1" />
        </g>

        {/* Detalhes — Mountain: lago + pedras */}
        <ellipse cx="425" cy="80" rx="32" ry="14" fill="url(#p-water)" stroke="#2b1a0c" strokeWidth="1.5" />
        {[[395, 55], [470, 55], [495, 100]].map(([cx, cy], i) => (
          <rect key={`rock-${i}`} x={cx} y={cy} width="10" height="8" fill="#7a7470" stroke="#2b1a0c" strokeWidth="1" />
        ))}
        {/* Entrada da mina */}
        <g>
          <rect x="540" y="78" width="20" height="14" fill="#2b1a0c" />
          <rect x="540" y="78" width="20" height="3" fill="#5b3a1f" />
        </g>

        {/* Detalhes — Praia: ondas + cais */}
        {[[230, 360], [280, 380], [340, 365], [400, 380]].map(([cx, cy], i) => (
          <path key={`wave-${i}`} d={`M ${cx} ${cy} q 4 -4 8 0 t 8 0`} stroke="#4f8fb3" strokeWidth="1.5" fill="none" />
        ))}
        {/* Cais */}
        <rect x="395" y="300" width="6" height="40" fill="#7a4e26" stroke="#2b1a0c" strokeWidth="1" />

        {/* Detalhes — Deserto: cacto */}
        <g>
          <rect x="568" y="180" width="6" height="14" fill="#5a9b2c" />
          <rect x="562" y="184" width="6" height="4" fill="#5a9b2c" />
        </g>

        {/* Detalhes — Ilha: palmeira */}
        <g>
          <rect x="500" y="345" width="3" height="18" fill="#5b3a1f" />
          <polygon points="494,345 510,345 502,335" fill="#5a9b2c" />
        </g>
        <g>
          <rect x="560" y="355" width="3" height="18" fill="#5b3a1f" />
          <polygon points="554,355 570,355 562,345" fill="#5a9b2c" />
        </g>

        {/* Labels — só nas regiões grandes */}
        {REGIONS.filter((r) => r.h > 40).map((r) => {
          const isHighlight = highlight?.id === r.id;
          const dim = highlight && !isHighlight;
          return (
            <g key={`l-${r.id}`} opacity={dim ? 0.4 : 1}>
              <rect
                x={(r.labelX ?? r.x + r.w / 2) - r.name.length * 3 - 4}
                y={(r.labelY ?? r.y + r.h / 2) - 7}
                width={r.name.length * 6 + 8}
                height="14"
                fill="#fbf2dc"
                stroke="#2b1a0c"
                strokeWidth="1"
                opacity="0.92"
              />
              <text
                x={r.labelX ?? r.x + r.w / 2}
                y={(r.labelY ?? r.y + r.h / 2) + 3}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-vt323), monospace"
                fontWeight="700"
                fill={isHighlight ? "#c4453a" : "#3a2412"}
                pointerEvents="none"
              >
                {r.name}
              </text>
            </g>
          );
        })}

        {/* Pin */}
        {highlight && (
          <g transform={`translate(${highlight.pinX ?? highlight.x + highlight.w / 2} ${(highlight.pinY ?? highlight.y + highlight.h / 2) - 18})`}>
            <circle cx="0" cy="22" r="12" fill="#e9a72c" opacity="0.4" className="origin-center [animation:sds-pulse_2s_ease-in-out_infinite] motion-reduce:hidden" />
            <path d="M 0 0 C -8 0 -12 6 -12 12 C -12 20 0 32 0 32 C 0 32 12 20 12 12 C 12 6 8 0 0 0 Z" fill="#c4453a" stroke="#2b1a0c" strokeWidth="2" />
            <circle cx="0" cy="12" r="4" fill="#fbf2dc" stroke="#2b1a0c" strokeWidth="1" />
          </g>
        )}
      </svg>

      {!highlight && location && (
        <div className="px-3 py-2 text-xs text-ink-soft border-t-2 border-wood-dark bg-paper-deep">
          Local: {location}
        </div>
      )}
    </div>
  );
}
