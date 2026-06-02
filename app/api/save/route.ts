import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "concepts.json");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.id || !body.input || !body.output) {
    return NextResponse.json(
      { error: "Invalid concept object" },
      { status: 400 }
    );
  }

  try {
    let concepts: unknown[] = [];
    try {
      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      if (raw.trim()) concepts = JSON.parse(raw);
    } catch {
      concepts = [];
    }

    const idx = (concepts as { id: string }[]).findIndex((c) => c.id === body.id);
    if (idx !== -1) {
      concepts[idx] = body;
    } else {
      concepts.push(body);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(concepts, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: body.id }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
