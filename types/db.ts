export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat_messages: {
        Row: ChatMessage;
        Insert: Omit<ChatMessage, "id" | "created_at">;
        Update: Partial<Omit<ChatMessage, "id" | "created_at">>;
      };
      macetes: {
        Row: Macete;
        Insert: Omit<Macete, "id" | "created_at">;
        Update: Partial<Omit<Macete, "id" | "created_at">>;
      };
      bugs: {
        Row: Bug;
        Insert: Omit<Bug, "id" | "created_at">;
        Update: Partial<Omit<Bug, "id" | "created_at">>;
      };
      missoes: {
        Row: Missao;
        Insert: Omit<Missao, "id" | "created_at">;
        Update: Partial<Omit<Missao, "id" | "created_at">>;
      };
      ids: {
        Row: ItemId;
        Insert: Omit<ItemId, "id" | "created_at">;
        Update: Partial<Omit<ItemId, "id" | "created_at">>;
      };
      npcs: {
        Row: Npc;
        Insert: Omit<Npc, "id" | "created_at">;
        Update: Partial<Omit<Npc, "id" | "created_at">>;
      };
    };
  };
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any;
  created_at: string;
}

export interface Macete {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  tutorial: string | null;
  categoria: "dinheiro" | "itens" | "energia" | "tempo" | "combate" | "fazenda";
  tags: string[];
  plataformas: string[];
  versao_inicio: string | null;
  versao_fim: string | null;
  funciona: boolean;
  fonte_url: string | null;
  popularidade: number;
  created_at: string;
}

export interface Bug {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  tutorial: string | null;
  versao: string;
  versao_fix: string | null;
  plataformas: string[];
  status: "ativo" | "corrigido" | "parcial";
  severidade: "baixa" | "media" | "alta";
  fonte_url: string | null;
  created_at: string;
}

export interface Missao {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  tipo: "story" | "help_wanted" | "special_order" | "mr_qi";
  npc: string | null;
  npc_id: string | null;
  como_obter: string | null;
  localizacao: string | null;
  recompensa: string | null;
  requisitos: string | null;
  dificuldade: number;
  versao_adicionada: string | null;
  fonte_url: string | null;
  created_at: string;
}

export interface ItemId {
  id: string;
  nome: string;
  codigo: string;
  string_id: string | null;
  categoria:
    | "gema"
    | "fruta"
    | "vegetal"
    | "peixe"
    | "mineral"
    | "artefato"
    | "forrageiro"
    | "recurso"
    | "artisan"
    | "especial"
    | "semente"
    | "barra"
    | "slime-egg";
  descricao: string | null;
  preco_venda: number | null;
  fonte_obtencao: string | null;
  fonte_url: string | null;
  created_at: string;
}

export interface Npc {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  localizacao: string | null;
  aniversario: string | null;
  presentes_amados: string[];
  presentes_odiados: string[];
  romanceable: boolean;
  fonte_url: string | null;
  created_at: string;
}
