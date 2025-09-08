import { useEffect, useState } from 'react';

export function usePlatformInfo() {
  const [platformInfo, setPlatformInfo] = useState<chrome.runtime.PlatformInfo | null>(null);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlatformInfo() {
      try {
        setError(null);
        const info = await chrome.runtime.getPlatformInfo();
        setPlatformInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get platform info'));
      }
    }

    void fetchPlatformInfo();
  }, []);

  return { platformInfo, isWindows: platformInfo?.os === 'win', error };
}
