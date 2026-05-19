"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { CalendarDay, SeasonalEvent } from "@/types/calendar";

/** Ícones SVG inline para cada festival (pixel-art style) */
const FESTIVAL_ICONS: Record<string, string> = {
  "egg-festival": "🥚",
  "flower-dance": "💐",
  "luau": "🌺",
  "dance-of-the-moonlight-jellies": "🌊",
  "stardew-valley-fair": "🎡",
  "spirits-eve": "🎃",
  "festival-of-ice": "❄️",
  "night-market-15": "🌙",
  "night-market-16": "🌙",
  "night-market-17": "🌙",
  "feast-of-the-winter-star": "⭐",
};

const SEASON_LABELS = ["Primavera", "Verão", "Outono", "Inverno"] as const;

const SEASON_STYLES = [
  {
    // Primavera
    active: "bg-[#7bb53f] text-white border-[#5a8c2a]",
    inactive: "bg-paper-deep text-ink-soft border-wood-dark hover:bg-[#7bb53f]/20",
    dot: "bg-[#7bb53f]",
    header: "text-[#5a8c2a]",
    cellActive: "bg-[#7bb53f]/15 border-[#7bb53f]",
  },
  {
    // Verão
    active: "bg-gold text-ink border-[#c9a000]",
    inactive: "bg-paper-deep text-ink-soft border-wood-dark hover:bg-gold/20",
    dot: "bg-gold",
    header: "text-[#a07800]",
    cellActive: "bg-gold/15 border-gold",
  },
  {
    // Outono
    active: "bg-[#e07b39] text-white border-[#b05a1a]",
    inactive: "bg-paper-deep text-ink-soft border-wood-dark hover:bg-[#e07b39]/20",
    dot: "bg-[#e07b39]",
    header: "text-[#b05a1a]",
    cellActive: "bg-[#e07b39]/15 border-[#e07b39]",
  },
  {
    // Inverno
    active: "bg-water text-ink border-[#5aa8c0]",
    inactive: "bg-paper-deep text-ink-soft border-wood-dark hover:bg-water/20",
    dot: "bg-water",
    header: "text-[#3a88a0]",
    cellActive: "bg-water/15 border-water",
  },
] as const;

interface Props {
  days: CalendarDay[][];
}

export function SeasonalCalendar({ days }: Props) {
  const [activeSeason, setActiveSeason] = useState(0);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const style = SEASON_STYLES[activeSeason];
  const currentDays = days[activeSeason] ?? [];

  function handleDayClick(day: CalendarDay) {
    if (day.eventos.length === 0) return;
    setSelectedDay((prev) => (prev?.dia === day.dia ? null : day));
  }

  function handleSeasonChange(idx: number) {
    setActiveSeason(idx);
    setSelectedDay(null);
  }

  return (
    <div className="mt-3">
      {/* Tabs de estação */}
      <div role="tablist" className="flex gap-1.5 flex-wrap mb-4">
        {SEASON_LABELS.map((label, idx) => (
          <button
            key={label}
            role="tab"
            aria-selected={activeSeason === idx}
            onClick={() => handleSeasonChange(idx)}
            className={`px-3 py-1.5 text-sm font-display uppercase tracking-wide border-2 rounded-sm transition-colors duration-100 ${
              activeSeason === idx
                ? SEASON_STYLES[idx].active
                : SEASON_STYLES[idx].inactive
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid 7×4 */}
      <div
        role="grid"
        className="grid grid-cols-7 gap-1"
      >
        {currentDays.map((day) => {
          const hasEvents = day.eventos.length > 0;
          const isSelected = selectedDay?.dia === day.dia;
          const visibleEvents = day.eventos.slice(0, 2);
          const overflow = day.eventos.length - 2;

          const ariaLabel = hasEvents
            ? `Dia ${day.dia} — ${day.eventos.map((e) => e.nome).join(", ")}`
            : `Dia ${day.dia} — sem eventos`;

          return (
            <div
              key={day.dia}
              role="gridcell"
              aria-label={ariaLabel}
              onClick={() => handleDayClick(day)}
              className={`
                relative min-h-[44px] rounded-sm border-2 p-1 flex flex-col
                transition-colors duration-100
                ${hasEvents ? "cursor-pointer" : "cursor-default"}
                ${
                  isSelected
                    ? style.cellActive
                    : hasEvents
                    ? "border-wood-dark/60 bg-paper-deep hover:border-wood-dark"
                    : "border-wood-dark/30 bg-paper-deep/50"
                }
              `}
            >
              {/* Número do dia */}
              <span
                className={`text-[11px] font-mono leading-none mb-0.5 ${
                  hasEvents ? "text-ink font-bold" : "text-ink-soft"
                }`}
              >
                {day.dia}
              </span>

              {/* Indicadores — modo compacto mobile, expandido sm+ */}
              <div className="flex flex-col gap-0.5 min-w-0">
                {visibleEvents.map((ev) => (
                  <EventIndicator key={ev.slug} event={ev} dotColor={style.dot} />
                ))}
                {overflow > 0 && (
                  <span className="text-[9px] text-ink-soft font-mono">+{overflow}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de detalhe */}
      {selectedDay && (
        <div className="mt-3">
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className={`font-display text-lg uppercase tracking-wide ${style.header}`}>
                Dia {selectedDay.dia} — {SEASON_LABELS[activeSeason]}
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-ink-soft hover:text-ink text-xs font-mono transition-colors"
                aria-label="Fechar painel"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 divide-y divide-wood-dark/20">
              {selectedDay.eventos.map((ev) => (
                <EventDetail key={ev.slug} event={ev} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/** Indicador compacto dentro da célula do calendário */
function EventIndicator({
  event,
  dotColor,
}: {
  event: SeasonalEvent;
  dotColor: string;
}) {
  if (event.tipo === "aniversario") {
    const shortName = event.nome.split(" ")[0];
    return (
      <div className="flex items-center gap-0.5 min-w-0" title={event.nome}>
        {event.retrato ? (
          <img
            src={`/sprites/npcs/${event.retrato}`}
            alt={event.nome}
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
            className="shrink-0 w-5 h-5 rounded-sm border border-wood-dark/40 object-cover bg-paper-deep"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dotColor}`} />
        )}
        <span className="hidden sm:inline text-[9px] leading-none text-ink truncate">
          {shortName}
        </span>
      </div>
    );
  }

  // Festival
  const icon = FESTIVAL_ICONS[event.slug] ?? "🎪";
  const shortName = event.nome.split(" ").slice(0, 2).join(" ");
  return (
    <div className="flex items-center gap-0.5 min-w-0" title={event.nome}>
      <span className="shrink-0 text-[12px] leading-none">{icon}</span>
      <span className="hidden sm:inline text-[9px] leading-none text-ink truncate">
        {shortName}
      </span>
    </div>
  );
}

/** Detalhe completo de um evento no painel inferior */
function EventDetail({ event }: { event: SeasonalEvent }) {
  if (event.tipo === "aniversario") {
    return (
      <div className="pt-2 first:pt-0 flex gap-3">
        {/* Retrato do NPC */}
        {event.retrato ? (
          <img
            src={`/sprites/npcs/${event.retrato}`}
            alt={event.nome}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="shrink-0 w-12 h-12 rounded-sm border-2 border-wood-dark/40 object-cover bg-paper-deep"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <div className="shrink-0 w-12 h-12 rounded-sm border-2 border-wood-dark/40 bg-paper-deep flex items-center justify-center text-xl">
            🎂
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-base text-ink">{event.nome}</span>
            <span className="text-xs text-ink-soft font-mono bg-paper-deep border border-wood-dark/30 rounded-sm px-1.5 py-0.5">
              🎂 aniversário
            </span>
          </div>
          {event.presentes_amados && event.presentes_amados.length > 0 && (
            <div>
              <span className="text-xs text-ink-soft">Presentes amados: </span>
              <span className="text-xs text-ink">
                {event.presentes_amados.slice(0, 5).join(", ")}
                {event.presentes_amados.length > 5 && ` +${event.presentes_amados.length - 5}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const icon = FESTIVAL_ICONS[event.slug] ?? "🎪";
  return (
    <div className="pt-2 first:pt-0 flex gap-3">
      {/* Ícone do festival */}
      <div className="shrink-0 w-12 h-12 rounded-sm border-2 border-wood-dark/40 bg-paper-deep flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-base text-ink">{event.nome}</span>
          {event.localizacao && (
            <span className="text-xs text-ink-soft font-mono bg-paper-deep border border-wood-dark/30 rounded-sm px-1.5 py-0.5">
              📍 {event.localizacao}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">{event.descricao}</p>
      </div>
    </div>
  );
}
