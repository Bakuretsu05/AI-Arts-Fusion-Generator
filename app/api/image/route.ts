import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.promptText || !body.conceptId || body.promptId === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt: body.promptText,
      n: 1,
      size: "1024x1024",
      quality: "medium",
    });

    const imageData = response.data?.[0];
    if (!imageData) {
      return NextResponse.json(
        { error: "No image returned" },
        { status: 500 }
      );
    }

    const imageUrl = imageData.url
      ? imageData.url
      : `data:image/png;base64,${imageData.b64_json}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
