import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

interface Params { params: Promise<{ slug: string }> }

const NO_CACHE = { "Cache-Control": "no-store" };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const supabase = getClient();
  if (!supabase) return NextResponse.json({ works: 0, broken: 0, enabled: false }, { headers: NO_CACHE });

  const { data, error } = await supabase
    .from("macete_votes")
    .select("vote")
    .eq("macete_slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });

  const works = (data ?? []).filter((r) => r.vote === "works").length;
  const broken = (data ?? []).filter((r) => r.vote === "broken").length;
  return NextResponse.json({ works, broken, enabled: true }, { headers: NO_CACHE });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const body = await req.json().catch(() => null) as { vote?: string; session_id?: string } | null;
  if (!body?.vote || !body?.session_id) {
    return NextResponse.json({ error: "vote and session_id required" }, { status: 400 });
  }
  if (body.vote !== "works" && body.vote !== "broken") {
    return NextResponse.json({ error: "vote must be 'works' or 'broken'" }, { status: 400 });
  }

  const supabase = getClient();
  if (!supabase) return NextResponse.json({ ok: false, enabled: false });

  // Upsert: muda o voto se a mesma session_id votou antes (unique constraint)
  const { error } = await supabase
    .from("macete_votes")
    .upsert(
      { macete_slug: slug, vote: body.vote, session_id: body.session_id },
      { onConflict: "macete_slug,session_id" },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, enabled: true });
}
