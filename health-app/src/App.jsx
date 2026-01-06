import React, { useState } from "react";
import { BrainCircuit, Info } from "lucide-react";

export default function App() {
  const [results, setResults] = useState([]);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState("");

  const handleScan = async () => {
    if (!inputData) return alert("Please enter ingredients first!");
    setLoading(true);
    setResults([]);

    try {
      const ingredients = inputData
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const response = await fetch(
        "https://vsp312007.app.n8n.cloud/webhook/analyze-ingredient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("n8n response:", data);

      let parsed = data;

      if (data?.output && typeof data.output === "string") {
        parsed = JSON.parse(data.output);
      }

      if (typeof data === "string") {
        parsed = JSON.parse(data);
      }

      setResults(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const riskScore = (theme) => (theme === "danger" ? 75 : 20);

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-colors
      ${
        dark
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header className="mb-10 text-center relative w-full max-w-md">
        <h1 className="text-4xl font-bold flex items-center gap-2 justify-center">
          <BrainCircuit className="text-emerald-400" />
          Health Co-pilot
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className="absolute top-0 right-0 text-xs px-3 py-1 rounded-full
          bg-slate-200 text-slate-800 hover:bg-slate-300 transition"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <p className="text-slate-400 mt-2">
          AI-Native Ingredient Intelligence
        </p>
      </header>

      {/* Card */}
      <main className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 text-slate-900">
        {/* Input */}
        <textarea
          className="w-full p-4 rounded-2xl bg-slate-100 focus:ring-2 focus:ring-emerald-500 transition h-32 resize-none"
          placeholder="Enter ingredients (e.g. amla, sugar, turmeric)"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          disabled={loading}
        />

        {/* Button */}
        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-4 rounded-2xl
          hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            "Analyze Ingredients"
          )}
        </button>

        {/* Results */}
        {results.map((result, idx) => (
          <div
            key={idx}
            className={`mt-6 p-5 rounded-3xl border transition-all
            ${
              result.theme === "danger"
                ? "bg-red-50 border-red-300"
                : "bg-emerald-50 border-emerald-300"
            }`}
          >
            {/* Badge */}
            <span
              className={`inline-block mb-3 text-xs font-semibold px-3 py-1 rounded-full
              ${
                result.theme === "danger"
                  ? "bg-red-500 text-white"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {result.theme === "danger" ? "⚠ Caution" : "✓ Safe"}
            </span>

            {/* Insight */}
            <h2 className="text-lg font-bold leading-snug">
              {result.main_insight}
            </h2>

            {/* Risk Bar */}
            <div className="mt-3">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.theme === "danger"
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${riskScore(result.theme)}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-slate-600">
                Risk score: {riskScore(result.theme)} / 100
              </p>
            </div>

            {/* Reasoning */}
            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              <strong>Why?</strong> {result.reasoning}
            </p>

            {/* Honest Note */}
            <div className="mt-4 flex gap-2 items-start bg-white/70 p-3 rounded-xl border">
              <Info size={16} className="text-slate-400 mt-0.5" />
              <p className="text-xs italic text-slate-600">
                {result.uncertainty}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
