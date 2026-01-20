"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!resume || !jd) {
      setError("Please upload both resume and job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume_file", resume);
    formData.append("jd_file", jd);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Resume Copilot
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Upload your resume and a job description to receive structured,
            actionable feedback tailored to the role.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Resume */}
          <div className="border rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:bg-gray-100 file:text-gray-700
                         hover:file:bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">PDF or DOCX</p>
          </div>

          {/* JD */}
          <div className="border rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setJd(e.target.files?.[0] || null)}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:bg-gray-100 file:text-gray-700
                         hover:file:bg-gray-200"
            />
            <p className="text-xs text-gray-500 mt-1">PDF, DOCX, or TXT</p>
          </div>
        </div>

        {error && (
          <p className="text-red-600 mt-4 text-sm">{error}</p>
        )}

        {/* Button */}
        <div className="mt-8">
          <button
            onClick={analyze}
            disabled={loading}
            className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl
                       hover:opacity-90 transition font-medium"
          >
            {loading ? "Analyzing…" : "Analyze Resume"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-12 space-y-8">
            <ResultSection title="Strengths" items={result.strengths} />
            <ResultSection title="Missing Skills" items={result.missing_skills} />

            <div>
              <h3 className="font-medium text-lg mb-2">Improved Summary</h3>
              <p className="text-gray-700">{result.improved_summary}</p>
            </div>

            <ResultSection
              title="Suggested Resume Bullets"
              items={result.suggested_bullets}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function ResultSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="font-medium text-lg mb-3">{title}</h3>
      <ul className="space-y-2 list-disc pl-5 text-gray-700">
        {items?.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
