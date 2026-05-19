import { Heart, MapPin, Clock } from "lucide-react";

interface Event {
  hearts: number;
  local: string;
  condicao: string;
  resumo: string;
}

interface Props {
  eventos: Event[];
}

export function HeartEventList({ eventos }: Props) {
  if (!eventos || eventos.length === 0) {
    return (
      <p className="text-sm text-ink-soft italic">
        Sem eventos de coração mapeados para este personagem.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {eventos.map((e, i) => (
        <li
          key={i}
          className="wood-frame rounded-sm p-3 relative"
        >
          {/* Threshold badge */}
          <div className="absolute -top-2 -left-2 inline-flex items-center gap-1 rounded-sm border-2 border-wood-dark bg-berry text-paper-soft px-2 py-0.5 text-xs font-bold shadow-[0_2px_0_var(--color-wood-dark)]">
            <Heart size={10} className="fill-paper-soft" />
            <span>{e.hearts}❤</span>
          </div>

          <div className="pt-2 space-y-1.5">
            <p className="text-sm text-ink font-medium leading-snug">{e.resumo}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} /> {e.local}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} /> {e.condicao}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
