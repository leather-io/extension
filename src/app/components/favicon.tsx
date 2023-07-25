import { useState } from 'react';

interface FaviconProps {
  origin: string;
}

export function Favicon({ origin }: FaviconProps) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${origin}`}
      onError={() => setHasError(true)}
    />
  );
}
