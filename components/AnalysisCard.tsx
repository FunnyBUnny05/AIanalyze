"use client";

interface AnalysisCardProps {
  analysis: string;
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  // Split analysis into sections for better formatting
  const sections = analysis.split("\n\n").filter(Boolean);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <h2 className="text-xl font-bold text-white">Claude AI Analysis</h2>
      </div>

      <div className="prose prose-invert max-w-none">
        {sections.map((section, index) => {
          // Check if section is a header (starts with **)
          if (section.startsWith("**")) {
            const headerMatch = section.match(/\*\*(.*?)\*\*/);
            if (headerMatch) {
              const header = headerMatch[1];
              const content = section.replace(/\*\*(.*?)\*\*/, "").trim();
              return (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    {header}
                  </h3>
                  <div className="text-slate-300 whitespace-pre-line">
                    {content}
                  </div>
                </div>
              );
            }
          }
          return (
            <p key={index} className="text-slate-300 mb-4 whitespace-pre-line">
              {section}
            </p>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-200">
          ⚠️ <strong>Disclaimer:</strong> This analysis is for educational
          purposes only and should not be considered financial advice. Always
          conduct your own research and consult with a financial advisor before
          making investment decisions.
        </p>
      </div>
    </div>
  );
}
