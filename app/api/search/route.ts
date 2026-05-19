import { NextRequest, NextResponse } from "next/server";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import missoesData from "@/data/seed/missoes.json";
import idsData from "@/data/seed/ids.json";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  const cache = { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" };
  switch (type) {
    case "macetes": return NextResponse.json(macetesData, { headers: cache });
    case "bugs": return NextResponse.json(bugsData, { headers: cache });
    case "missoes": return NextResponse.json(missoesData, { headers: cache });
    case "ids": return NextResponse.json(idsData, { headers: cache });
    default: return NextResponse.json({ error: "type required" }, { status: 400 });
  }
}
