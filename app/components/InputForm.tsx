"use client";

import { useState } from "react";

interface FormData {
  sourceA: string;
  sourceB: string;
  domain: string;
  mood: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [fields, setFields] = useState<FormData>({
    sourceA: "",
    sourceB: "",
    domain: "",
    mood: "",
  });

  const handleChange = (key: keyof FormData, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!fields.sourceA || !fields.sourceB || !fields.domain || !fields.mood) {
      return;
    }
    onSubmit(fields);
  };

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-semibold text-black">
        Cultural Fusion Concept Generator
      </h1>
      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-black">
            Source A
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Indonesian batik"
            value={fields.sourceA}
            onChange={(e) => handleChange("sourceA", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-black">
            Source B
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Cyberpunk neon signage"
            value={fields.sourceB}
            onChange={(e) => handleChange("sourceB", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-black">
            Domain
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Cafe interior, Fashion, Poster design"
            value={fields.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-black">
            Mood
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Calm but futuristic"
            value={fields.mood}
            onChange={(e) => handleChange("mood", e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={
            !fields.sourceA ||
            !fields.sourceB ||
            !fields.domain ||
            !fields.mood
          }
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate Fusion Concept
        </button>
      </div>
    </div>
  );
}
