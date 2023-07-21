import { Text } from '@stacks/ui';

import { SupportedBlockchains } from '@shared/constants';

import { Capitalize } from '@app/components/text/capitalize';
import { WarningLabel } from '@app/components/warning-label';

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
        <Text as="a" textDecoration="underline" href="ledgerlive://manager">
          Update on Ledger Live to continue
        </Text>
      </WarningLabel>
    );
  }
  if (latestDeviceResponse.deviceLocked)
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        Your Ledger is locked. Unlock it and open the Stacks app to continue.
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
