import { BITCOIN_ENABLED } from './environment';

export const featureFlags = {
  bitcoinEnabled: !!BITCOIN_ENABLED,
  ledgerEnabled: true,
};

(globalThis as any).setBitcoinFeature = (val: boolean) => (featureFlags.bitcoinEnabled = val);
