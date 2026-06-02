interface ConceptCardProps {
  conceptParagraph: string;
  featuresA: string[];
  featuresB: string[];
  sourceA: string;
  sourceB: string;
}

export default function ConceptCard({
  conceptParagraph,
  featuresA,
  featuresB,
  sourceA,
  sourceB,
}: ConceptCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Fusion Concept
      </p>
      <p className="mb-6 leading-relaxed text-gray-700">{conceptParagraph}</p>

      <hr className="mb-6 border-gray-100" />

      <div className="grid grid-cols-2 gap-6">
        {/* Source A */}
        <div>
          <span className="mb-3 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {sourceA}
          </span>
          <ul className="mt-2 space-y-2">
            {featuresA.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Source B */}
        <div>
          <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {sourceB}
          </span>
          <ul className="mt-2 space-y-2">
            {featuresB.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
