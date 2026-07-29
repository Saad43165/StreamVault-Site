'use client';

import { useState } from 'react';

export default function ReadMore({ text, maxChars = 280 }: { text: string; maxChars?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxChars) return <p className="text-white/70 leading-relaxed">{text}</p>;
  return (
    <div>
      <p className="text-white/70 leading-relaxed">
        {expanded ? text : `${text.slice(0, maxChars).trim()}...`}
      </p>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="text-vault-accent hover:text-vault-accent-hover text-sm font-semibold mt-1.5 transition-colors"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
}
