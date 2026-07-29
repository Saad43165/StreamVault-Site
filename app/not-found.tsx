import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function notFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vault-bg px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <p className="text-7xl sm:text-9xl font-black text-vault-accent/20 mb-2">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-white/50 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-vault-accent hover:bg-vault-accent-hover text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
