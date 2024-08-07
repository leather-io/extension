import { useHasLedgerKeys } from '@app/store/ledger/ledger.selectors';
import { useCurrentKeyDetails } from '@app/store/software-keys/software-key.selectors';

export function useHasKeys() {
  const hasSoftwareKeys = !!useCurrentKeyDetails();
  const hasLedgerKeys = useHasLedgerKeys();

  return {
    hasSoftwareKeys,
    hasLedgerKeys,
    hasKeys: hasSoftwareKeys || hasLedgerKeys,
  };
}
