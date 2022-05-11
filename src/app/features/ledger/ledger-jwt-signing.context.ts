import { createContext } from 'react';

import { noop } from '@app/common/utils';
import { getAppVersion } from './ledger-utils';

export interface LedgerJwtSigningProvider {
  latestDeviceResponse: null | Awaited<ReturnType<typeof getAppVersion>>;
  awaitingDeviceConnection: boolean;
  signJwtPayload(): Promise<void> | void;
  jwtPayloadHash: null | string;
}

export const ledgerJwtSigningContext = createContext<LedgerJwtSigningProvider>({
  latestDeviceResponse: null,
  awaitingDeviceConnection: false,
  signJwtPayload: noop,
  jwtPayloadHash: null,
});

export const LedgerJwtSigningProvider = ledgerJwtSigningContext.Provider;
