import { useMemo, useState } from 'react';

export function useRequestAccountsInfo() {
  const [accountKeys, setAccountKeys] = useState(null);
  return useMemo(
    () => ({
      accountKeys,
      setAccountKeys,
    }),
    [accountKeys]
  );
}
