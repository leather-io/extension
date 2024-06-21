import { createContext, useContext } from 'react';

import type { SupportedBlockchains } from '@leather.io/models';

import { BaseLedgerOperationContext } from '../../utils/generic-ledger-utils';

export interface LedgerRequestKeysContext extends BaseLedgerOperationContext {
  chain: SupportedBlockchains;
  pullPublicKeysFromDevice(): Promise<void>;
  outdatedAppVersionWarning: boolean;
}

const ledgerRequestKeysContext = createContext<LedgerRequestKeysContext | null>(null);

export function useLedgerRequestKeysContext() {
  const context = useContext(ledgerRequestKeysContext);
  if (!context) throw new Error('No LedgerRequestKeysContext found');
  return context;
}

export const LedgerRequestKeysProvider = ledgerRequestKeysContext.Provider;
