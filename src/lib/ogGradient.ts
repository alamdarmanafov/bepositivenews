const TAILWIND_HEX: Record<string, string> = {
  "amber-200": "#fde68a",
  "amber-400": "#fbbf24",
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "slate-500": "#64748b",
  "slate-700": "#334155",
  "cyan-400": "#22d3ee",
  "cyan-500": "#06b6d4",
  "teal-300": "#5eead4",
  "teal-400": "#2dd4bf",
  "teal-600": "#0d9488",
  "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399",
  "emerald-500": "#10b981",
  "green-500": "#22c55e",
  "sky-500": "#0ea5e9",
  "pink-400": "#f472b6",
  "fuchsia-400": "#e879f9",
  "purple-500": "#a855f7",
  "rose-400": "#fb7185",
  "violet-500": "#8b5cf6",
};

const FALLBACK: [string, string, string] = ["#2563eb", "#1d4ed8", "#1e3a8a"];

export function gradientToCssStops(gradientClasses: string): [string, string, string] {
  const tokens = gradientClasses.match(/(?:from|via|to)-([a-z]+-\d+)/g) ?? [];
  const colors = tokens.map((token) => TAILWIND_HEX[token.replace(/^(from|via|to)-/, "")]).filter(Boolean);

  return [colors[0] ?? FALLBACK[0], colors[1] ?? FALLBACK[1], colors[2] ?? FALLBACK[2]];
}
