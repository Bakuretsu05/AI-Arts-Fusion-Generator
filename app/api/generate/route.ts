import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a structured design ideation assistant specializing in combinational creativity. Your role is to help designers fuse two distinct cultural or visual traditions into a coherent, intentional design concept.

You must always respond with valid JSON only. No explanation, no preamble, no markdown. Just the JSON object.

The JSON must follow this exact shape:
{
  "conceptParagraph": "A 4-5 sentence paragraph describing the fused design concept. Be specific about how the two sources interact visually. Name actual visual mechanisms: how forms from one source structure the space, how colors from the other source define the atmosphere, how motifs from each source are reinterpreted in the new domain.",
  "featuresA": ["4 to 6 concrete visual traits from Source A. Each must name a specific visual property: a pattern type, a color family, a material quality, a compositional rule, a motif structure, or a lighting convention."],
  "featuresB": ["4 to 6 concrete visual traits from Source B. Same specificity requirement as featuresA."],
  "prompts": [
    {
      "id": 1,
      "direction": "A detailed image generation prompt of 3-5 sentences focused on FORM AND STRUCTURE. Describe the scene, the dominant visual elements, the color palette, the atmosphere, and the specific way the two sources are fused. Write it as if briefing a visual artist.",
      "imageUrl": null
    },
    {
      "id": 2,
      "direction": "A detailed image generation prompt of 3-5 sentences focused on COLOR AND ATMOSPHERE. Describe the scene, the dominant visual elements, the color palette, the atmosphere, and the specific way the two sources are fused. Write it as if briefing a visual artist.",
      "imageUrl": null
    },
    {
      "id": 3,
      "direction": "A detailed image generation prompt of 3-5 sentences focused on DETAIL AND ORNAMENTATION. Describe the scene, the dominant visual elements, the color palette, the atmosphere, and the specific way the two sources are fused. Write it as if briefing a visual artist.",
      "imageUrl": null
    }
  ]
}

Critical rules:
- The fusion must feel intentional and structured, not decorative or random
- Each of the 3 prompt directions must explore a different aspect of the fusion:
  Direction 1: focus on form and structure
  Direction 2: focus on color and atmosphere
  Direction 3: focus on detail and ornamentation
- Never use vague descriptors like "colorful", "modern", "beautiful", or "unique"
- Never reduce a culture to a single stereotype
- featuresA and featuresB must describe visual grammar, not cultural identity`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || !body.sourceA || !body.sourceB || !body.domain || !body.mood) {
    return NextResponse.json(
      { error: "Missing required fields: sourceA, sourceB, domain, mood" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  const userMessage = `Source A: ${body.sourceA}
Source B: ${body.sourceB}
Domain: ${body.domain}
Mood: ${body.mood}

Generate a structured fusion design concept.`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw ?? "{}");

    if (
      !parsed.conceptParagraph ||
      !Array.isArray(parsed.featuresA) ||
      !Array.isArray(parsed.featuresB) ||
      !Array.isArray(parsed.prompts)
    ) {
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
