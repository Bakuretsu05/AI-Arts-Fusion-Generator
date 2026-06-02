"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import InputForm from "@/app/components/InputForm";
import Link from "next/link";

interface FormData {
  sourceA: string;
  sourceB: string;
  domain: string;
  mood: string;
}

const HOW_IT_WORKS = [
  {
    icon: "🔀",
    title: "You choose the sources",
    description: "Pick two cultural or visual traditions and a design domain.",
  },
  {
    icon: "⚙️",
    title: "AI structures the fusion",
    description:
      "GPT-4o extracts visual features from each source and combines them into a coherent concept — not a random mix.",
  },
  {
    icon: "🖼",
    title: "You guide the image",
    description:
      "Choose which of three prompt directions to visualize with DALL-E 3.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const conceptId = uuidv4();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      const output = await res.json();

      const fullConcept = {
        id: conceptId,
        createdAt: new Date().toISOString(),
        input: {
          sourceA: data.sourceA,
          sourceB: data.sourceB,
          domain: data.domain,
          mood: data.mood,
        },
        output,
      };

      try {
        sessionStorage.setItem("fusionConcept", JSON.stringify(fullConcept));
        sessionStorage.setItem("fusionInput", JSON.stringify(data));
      } catch {
        throw new Error(
          "Could not save concept to session storage. Please allow storage in your browser."
        );
      }

      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 bg-gray-50">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-gray-600">Generating your fusion concept…</p>
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Cultural Fusion Concept Generator
            </h1>
            <p className="mt-2 text-gray-500">
              Combine two visual traditions into a structured design concept
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <InputForm onSubmit={handleSubmit} />

          {/* About section */}
          <div className="mt-8">
            <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
              How it works
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.title} className="text-center">
                  <div className="mb-2 text-2xl">{step.icon}</div>
                  <p className="mb-1 text-sm font-semibold text-gray-700">
                    {step.title}
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-gray-400">
              This tool supports combinational creativity — producing new ideas
              by combining existing visual systems in structured, intentional
              ways.
            </p>
          </div>

          <p className="mt-6 text-center text-sm">
            <Link
              href="/history"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              View History
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}
