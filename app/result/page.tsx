"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConceptCard from "@/app/components/ConceptCard";
import PromptCard from "@/app/components/PromptCard";

interface Prompt {
  id: number;
  direction: string;
  imageUrl: string | null;
  error?: string | null;
}

interface ConceptOutput {
  conceptParagraph: string;
  featuresA: string[];
  featuresB: string[];
  prompts: Prompt[];
}

interface FullConcept {
  id: string;
  createdAt: string;
  input: {
    sourceA: string;
    sourceB: string;
    domain: string;
    mood: string;
  };
  output: ConceptOutput;
}

export default function ResultPage() {
  const [concept, setConcept] = useState<FullConcept | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  useEffect(() => {
    let parsed: FullConcept;
    try {
      const rawConcept = sessionStorage.getItem("fusionConcept");
      if (!rawConcept) return;
      parsed = JSON.parse(rawConcept);
    } catch {
      return;
    }

    setConcept(parsed);

    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    }).catch((err) => console.error("Auto-save failed:", err));
  }, []);

  const handleGenerateImage = async (promptId: number, promptText: string) => {
    if (!concept) return;
    setGeneratingId(promptId);

    // Clear any previous error on this prompt
    setConcept((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        output: {
          ...prev.output,
          prompts: prev.output.prompts.map((p) =>
            p.id === promptId ? { ...p, error: null } : p
          ),
        },
      };
    });

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText, conceptId: concept.id, promptId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      const { imageUrl } = await res.json();

      const updatedConcept: FullConcept = {
        ...concept,
        output: {
          ...concept.output,
          prompts: concept.output.prompts.map((p) =>
            p.id === promptId ? { ...p, imageUrl, error: null } : p
          ),
        },
      };

      setConcept(updatedConcept);

      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConcept),
      }).catch((err) => console.error("Save after image failed:", err));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image generation failed.";
      setConcept((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          output: {
            ...prev.output,
            prompts: prev.output.prompts.map((p) =>
              p.id === promptId ? { ...p, error: message } : p
            ),
          },
        };
      });
    } finally {
      setGeneratingId(null);
    }
  };

  if (!concept) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 bg-gray-50">
        <p className="text-gray-700">No concept found. Go back to the home page.</p>
        <Link href="/" className="text-indigo-600 underline">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back
          </Link>
          <Link href="/history" className="text-sm text-indigo-600 hover:text-indigo-800 underline">
            View History
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {concept.input.sourceA} × {concept.input.sourceB}
          </h1>
          <p className="mt-1 text-gray-500">
            {concept.input.domain} · {concept.input.mood}
          </p>
        </div>

        {/* Concept Card */}
        <div className="mb-10">
          <ConceptCard
            conceptParagraph={concept.output.conceptParagraph}
            featuresA={concept.output.featuresA}
            featuresB={concept.output.featuresB}
            sourceA={concept.input.sourceA}
            sourceB={concept.input.sourceB}
          />
        </div>

        {/* Prompt Directions */}
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Prompt Directions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {concept.output.prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onGenerateImage={handleGenerateImage}
              isGenerating={generatingId === prompt.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
