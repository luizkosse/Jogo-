import { Gift, Sparkles, Home, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SpouseData {
  presentes_diarios?: string[];
  beneficio_unico?: string;
  stardrop?: string;
  quarto?: string;
  personalidade_casado?: string;
  nota?: string;
}

interface Props {
  data: SpouseData | undefined;
  nome: string;
}

export function MarriageInfo({ data, nome }: Props) {
  if (!data) {
    return (
      <Card className="text-sm text-ink-soft">
        <p>Dados de casamento ainda não mapeados para {nome}.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {data.presentes_diarios && data.presentes_diarios.length > 0 && (
        <div className="wood-frame rounded-sm p-3">
          <h3 className="font-display text-xl text-ink leading-none mb-2 flex items-center gap-2">
            <Gift size={16} className="text-berry" /> Presentes diários
          </h3>
          <p className="text-xs text-ink-soft mb-2">
            Itens que {nome} pode dar/cozinhar para você como cônjuge.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.presentes_diarios.map((p) => (
              <span
                key={p}
                className="inline-flex items-center rounded-sm border-2 border-wood-dark/40 bg-paper-deep px-2 py-0.5 text-xs font-mono text-ink"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.beneficio_unico && (
        <div className="wood-frame rounded-sm p-3">
          <h3 className="font-display text-xl text-ink leading-none mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-gold" /> Benefício único
          </h3>
          <p className="text-sm text-ink-soft">{data.beneficio_unico}</p>
        </div>
      )}

      {data.quarto && (
        <div className="wood-frame rounded-sm p-3">
          <h3 className="font-display text-xl text-ink leading-none mb-1 flex items-center gap-2">
            <Home size={16} className="text-water" /> Quarto do cônjuge
          </h3>
          <p className="text-sm text-ink-soft">{data.quarto}</p>
        </div>
      )}

      {data.personalidade_casado && (
        <div className="wood-frame rounded-sm p-3">
          <h3 className="font-display text-xl text-ink leading-none mb-1 flex items-center gap-2">
            <Heart size={16} className="text-berry fill-berry" /> Pós-casamento
          </h3>
          <p className="text-sm text-ink-soft">{data.personalidade_casado}</p>
        </div>
      )}

      {data.stardrop && (
        <p className="text-xs text-ink-soft italic">⭐ Stardrop: {data.stardrop}</p>
      )}

      {data.nota && (
        <p className="text-xs text-berry italic">⚠ {data.nota}</p>
      )}
    </div>
  );
}
