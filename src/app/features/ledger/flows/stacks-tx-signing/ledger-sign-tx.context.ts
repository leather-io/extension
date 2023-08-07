import { createContext, useContext } from 'react';

import { StacksTransaction } from '@stacks/transactions';

import { createWaitableAction } from '@app/common/utils/create-waitable-action';

import { BaseLedgerOperationContext } from '../../utils/generic-ledger-utils';

export function createWaitForUserToSeeWarningScreen() {
  return createWaitableAction<'ignored-warning' | 'cancelled-operation'>();
}

export interface LedgerTxSigningContext extends BaseLedgerOperationContext {
  transaction: StacksTransaction | null;
  signTransaction(): Promise<void> | void;
  hasUserSkippedBuggyAppWarning: ReturnType<typeof createWaitForUserToSeeWarningScreen>;
}

export const ledgerTxSigningContext = createContext<LedgerTxSigningContext | null>(null);

export function useLedgerTxSigningContext() {
  const context = useContext(ledgerTxSigningContext);
  if (!context) throw new Error('ledgerTxSigningContext is undefined');
  return context;
}

export const LedgerTxSigningProvider = ledgerTxSigningContext.Provider;
