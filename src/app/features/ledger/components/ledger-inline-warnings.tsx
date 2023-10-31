import { styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';

import { WarningLabel } from '@app/components/warning-label';
import { Capitalize } from '@app/ui/utils/capitalize';

import { isStacksLedgerAppClosed } from '../utils/stacks-ledger-utils';

interface CommonLedgerInlineWarningsProps {
  chain: SupportedBlockchains;
  latestDeviceResponse: any | null;
  outdatedLedgerAppWarning?: boolean;
}
export function CommonLedgerDeviceInlineWarnings({
  chain,
  latestDeviceResponse,
  outdatedLedgerAppWarning = false,
}: CommonLedgerInlineWarningsProps) {
  if (!latestDeviceResponse) return null;

  if (outdatedLedgerAppWarning) {
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        Latest version of <Capitalize>{chain} app</Capitalize> required
        <styled.a href="ledgerlive://manager" textDecoration="underline">
          Update on Ledger Live to continue
        </styled.a>
      </WarningLabel>
    );
  }
  if (latestDeviceResponse.deviceLocked)
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        Your Ledger is locked. Unlock it and open the {''}
        <Capitalize>{chain}</Capitalize>
        {''} app to continue.
      </WarningLabel>
    );
  if (isStacksLedgerAppClosed(latestDeviceResponse))
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        The <Capitalize>{chain}</Capitalize> app appears to be closed on Ledger. Open it to
        continue.
      </WarningLabel>
    );
  return null;
}
