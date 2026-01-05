import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-white">
          AI Stock Analyzer
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Technical analysis powered by AI. Get entry points, stop losses, and target prices based on real-time market data.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Launch Dashboard
        </Link>
      </div>
    </div>
  );
}
