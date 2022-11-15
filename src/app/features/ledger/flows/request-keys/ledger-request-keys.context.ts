import { createContext } from 'react';

import { noop } from '@shared/utils';

import { BaseLedgerOperationContext } from '../../ledger-utils';

export interface LedgerRequestKeysContext extends BaseLedgerOperationContext {
  pullPublicKeysFromDevice(): Promise<void> | void;
  outdatedAppVersionWarning: boolean;
}

export const ledgerRequestKeysContext = createContext<LedgerRequestKeysContext>({
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  pullPublicKeysFromDevice: noop,
  outdatedAppVersionWarning: false,
});

export const LedgerRequestKeysProvider = ledgerRequestKeysContext.Provider;
