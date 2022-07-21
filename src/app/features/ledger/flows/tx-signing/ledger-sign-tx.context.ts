import { createContext } from 'react';
import { StacksTransaction } from '@stacks/transactions';

import { noop } from '@shared/utils';
import { BaseLedgerOperationContext } from '../../ledger-utils';

export interface LedgerTxSigningContext extends BaseLedgerOperationContext {
  transaction: StacksTransaction | null;
  signTransaction(): Promise<void> | void;
}

export const ledgerTxSigningContext = createContext<LedgerTxSigningContext>({
  transaction: null,
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  signTransaction: noop,
});

export const LedgerTxSigningProvider = ledgerTxSigningContext.Provider;
