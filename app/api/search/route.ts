import { NextRequest, NextResponse } from "next/server";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import missoesData from "@/data/seed/missoes.json";
import idsData from "@/data/seed/ids.json";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  switch (type) {
    case "macetes": return NextResponse.json(macetesData);
    case "bugs": return NextResponse.json(bugsData);
    case "missoes": return NextResponse.json(missoesData);
    case "ids": return NextResponse.json(idsData);
    default: return NextResponse.json({ error: "type required" }, { status: 400 });
  }
}
