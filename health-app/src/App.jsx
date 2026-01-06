import React, { useState } from 'react';
import { Camera, AlertTriangle, ShieldCheck, BrainCircuit, Info } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputData, setInputData] = useState("");

  const handleScan = async () => {
    if (!inputData) return alert("Please enter ingredients first!");
    setLoading(true);
    try {
      // Connecting to your specific Production Webhook
      const response = await fetch('https://vsp312007.app.n8n.cloud/webhook/49de5a56-8d7a-450a-a1be-4f294ef39880', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: inputData })
      });
      const data = await response.json();
      setResult(data.output || data); 
    } catch (err) {
      alert("Failed to connect to the AI Brain. Ensure your n8n workflow is Published!");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen p-6 font-sans flex flex-col items-center transition-colors duration-500 ${result?.theme === 'danger' ? 'bg-red-50' : 'bg-slate-50'}`}>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center text-slate-900">
          <BrainCircuit className="text-blue-600" /> Health Co-pilot
        </h1>
        <p className="text-slate-500 mt-2">AI-Native Ingredient Intelligence</p>
      </header>

      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
        <textarea 
          className="w-full p-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 transition h-32"
          placeholder="Paste ingredient list here..."
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <button onClick={handleScan} disabled={loading} className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition disabled:bg-slate-300">
          {loading ? "AI is reasoning..." : "Analyze Ingredients"}
        </button>

        {result && (
          <div className={`mt-6 p-5 rounded-2xl border-l-8 ${result.theme === 'danger' ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500'}`}>
            <h2 className="font-bold text-lg text-slate-900">{result.main_insight}</h2>
            <p className="mt-2 text-sm text-slate-700"><strong>Reasoning:</strong> {result.reasoning}</p>
            <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
              <Info size={16} className="text-slate-400 shrink-0" />
              <p className="text-xs italic text-slate-500"><strong>Honest Note:</strong> {result.uncertainty}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}