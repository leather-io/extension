import { createContext } from 'react';

import { StacksTransaction } from '@stacks/transactions';

import { noop } from '@shared/utils';

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

export const ledgerTxSigningContext = createContext<LedgerTxSigningContext>({
  transaction: null,
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  signTransaction: noop,
  hasUserSkippedBuggyAppWarning: createWaitForUserToSeeWarningScreen(),
});

export const LedgerTxSigningProvider = ledgerTxSigningContext.Provider;
