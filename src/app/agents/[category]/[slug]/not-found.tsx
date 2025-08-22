import Link from 'next/link';

export default function AgentNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-white mb-4">Agent Not Found</h1>
        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
          The agent you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="space-y-4">
          <Link
            href="/agents"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Browse All Agents
          </Link>
          <div>
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
