import { createContext } from 'react';
import { StacksTransaction } from '@stacks/transactions';

import { noop } from '@app/common/utils';
import { getAppVersion } from './ledger-utils';

export interface LedgerTxSigningProvider {
  transaction: StacksTransaction | null;
  latestDeviceResponse: null | Awaited<ReturnType<typeof getAppVersion>>;
  awaitingDeviceConnection: boolean;
  signTransaction(): Promise<void> | void;
}

export const ledgerTxSigningContext = createContext<LedgerTxSigningProvider>({
  transaction: null,
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  signTransaction: noop,
});

export const LedgerTxSigningProvider = ledgerTxSigningContext.Provider;
