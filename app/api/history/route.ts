import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "concepts.json");

export async function GET() {
  try {
    let concepts: { createdAt: string }[] = [];
    try {
      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      if (raw.trim()) concepts = JSON.parse(raw);
    } catch {
      concepts = [];
    }

    concepts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(concepts, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
