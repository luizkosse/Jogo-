import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  const supabase = getClient();
  if (!supabase) return NextResponse.json([]); // Supabase não configurado — fallback silencioso

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, results, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.session_id || !body?.role || !body?.content) {
    return NextResponse.json({ error: "session_id, role, content required" }, { status: 400 });
  }

  const supabase = getClient();
  if (!supabase) return NextResponse.json({ ok: false, skipped: true }); // Sem Supabase, apenas localStorage

  const { error } = await supabase.from("chat_messages").insert({
    session_id: body.session_id,
    role: body.role,
    content: body.content,
    results: body.results ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
