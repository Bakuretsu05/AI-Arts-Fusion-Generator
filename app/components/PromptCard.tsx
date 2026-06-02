"use client";

import { useEffect, useState } from "react";

interface Prompt {
  id: number;
  direction: string;
  imageUrl: string | null;
  error?: string | null;
}

interface PromptCardProps {
  prompt: Prompt;
  onGenerateImage: (promptId: number, promptText: string) => void;
  isGenerating: boolean;
}

export default function PromptCard({
  prompt,
  onGenerateImage,
  isGenerating,
}: PromptCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen]);

  return (
    <>
      <div className="flex flex-col rounded-xl bg-white p-5 shadow-md">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Direction {prompt.id}
        </p>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-700">
          {prompt.direction}
        </p>

        <button
          onClick={() => onGenerateImage(prompt.id, prompt.direction)}
          disabled={isGenerating}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isGenerating
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isGenerating ? "Generating…" : "Generate Image"}
        </button>

        {prompt.error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {prompt.error}
          </p>
        )}

        {prompt.imageUrl && (
          <div className="mt-4">
            <button
              onClick={() => setLightboxOpen(true)}
              className="group relative block w-full overflow-hidden rounded-lg"
              aria-label="View fullscreen"
            >
              <img
                src={prompt.imageUrl}
                alt={`Generated image for direction ${prompt.id}`}
                className="w-full rounded-lg object-cover shadow transition-opacity group-hover:opacity-90"
              />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                  View fullscreen
                </span>
              </span>
            </button>
            <p className="mt-1 text-center text-xs text-gray-400">
              Generated with gpt-image-1
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && prompt.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={prompt.imageUrl}
            alt={`Direction ${prompt.id} fullscreen`}
            className="max-h-screen max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
