"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Prompt {
  id: number;
  direction: string;
  imageUrl: string | null;
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
  output: {
    conceptParagraph: string;
    featuresA: string[];
    featuresB: string[];
    prompts: Prompt[];
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HistoryPage() {
  const [concepts, setConcepts] = useState<FullConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((data) => setConcepts(data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, []);

  const images = (concept: FullConcept) =>
    concept.output.prompts.filter((p) => p.imageUrl).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Saved Concepts</h1>

        {loading && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <span className="text-sm text-gray-500">Loading…</span>
          </div>
        )}

        {!loading && fetchError && (
          <p className="text-sm text-red-600">
            Could not load history. Try again later.
          </p>
        )}

        {!loading && !fetchError && concepts.length === 0 && (
          <div className="text-center">
            <p className="text-gray-500">No saved concepts yet.</p>
            <Link
              href="/"
              className="mt-2 inline-block text-sm text-indigo-600 underline hover:text-indigo-800"
            >
              Go generate one!
            </Link>
          </div>
        )}

        {!loading && !fetchError && concepts.length > 0 && (
          <div className="space-y-4">
            {concepts.map((concept) => (
              <div key={concept.id} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-1 flex items-start justify-between gap-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    {concept.input.sourceA} × {concept.input.sourceB}
                  </h2>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatDate(concept.createdAt)}
                  </span>
                </div>

                <p className="mb-1 text-xs text-gray-500">
                  {concept.input.domain} · {concept.input.mood}
                </p>

                <p className="mb-4 text-sm leading-relaxed text-gray-700">
                  {concept.output.conceptParagraph.slice(0, 150)}
                  {concept.output.conceptParagraph.length > 150 ? "…" : ""}
                </p>

                {images(concept).length > 0 && (
                  <div className="flex gap-2">
                    {images(concept).map((p) => (
                      <img
                        key={p.id}
                        src={p.imageUrl!}
                        alt={`Direction ${p.id}`}
                        className="h-24 w-24 rounded-lg object-cover shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
