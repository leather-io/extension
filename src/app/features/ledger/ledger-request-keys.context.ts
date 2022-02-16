import { noop } from '@app/common/utils';
import { createContext } from 'react';
import { getAppVersion } from './ledger-utils';

export interface LedgerRequestKeysProvider {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getAppVersion>>;
  awaitingDeviceConnection: boolean;
  pullPublicKeysFromDevice(): Promise<void> | void;
}

export const ledgerRequestKeysContext = createContext<LedgerRequestKeysProvider>({
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  pullPublicKeysFromDevice: noop,
});

export const LedgerRequestKeysProvider = ledgerRequestKeysContext.Provider;
