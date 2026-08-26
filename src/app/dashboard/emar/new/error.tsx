"use client";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="p-10 max-w-2xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-2xl text-red-700">
      <h2 className="text-xl font-bold mb-4">Client Error Boundary</h2>
      <pre className="p-4 bg-white rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono text-red-900">
        {error?.message || "Unknown client error"}
      </pre>
      <pre className="p-4 mt-4 bg-white rounded-lg text-xs overflow-x-auto whitespace-pre-wrap font-mono text-red-900">
        {error?.stack || "No stack trace"}
      </pre>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Try Again</button>
    </div>
  );
}
