import React, { useState } from "react";
import { BrainCircuit, Info } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputData, setInputData] = useState("");

  const handleScan = async () => {
    if (!inputData.trim()) {
      alert("Please enter an ingredient");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://vsp312007.app.n8n.cloud/webhook/analyze-ingredient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredient: inputData.trim() }),
        }
      );

      const text = await response.text();
      if (!text) throw new Error("Empty response");

      const data = JSON.parse(text);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <BrainCircuit />
        Health Co-pilot
      </h1>
      <p className="text-gray-400 mt-2">
        AI-Native Ingredient Intelligence
      </p>

      {/* Input */}
      <div className="mt-6 flex gap-3">
        <textarea
          className="bg-[#2a2a2a] border border-gray-600 rounded px-3 py-2 w-64 resize-none"
          placeholder="Enter ingredient"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-black border border-gray-500 px-4 py-2 rounded hover:bg-gray-900"
        >
          {loading ? "Analyzing..." : "Analyze Ingredient"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-10 max-w-3xl">
          <p className="text-green-400 font-semibold mb-2">
            ✓ {result.theme === "danger" ? "Caution" : "Safe"}
          </p>

          <h2 className="text-2xl font-bold mb-4">
            {result.main_insight}
          </h2>

          <p className="mb-6">
            <strong>Why?</strong> {result.reasoning}
          </p>

          <div className="flex gap-2 text-gray-300 text-sm">
            <Info size={16} />
            <p>{result.uncertainty}</p>
          </div>
        </div>
      )}
    </div>
  );
}
