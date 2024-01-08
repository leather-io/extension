import { styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';

import { WarningLabel } from '@app/components/warning-label';
import { Capitalize } from '@app/ui/utils/capitalize';

import { LatestDeviceResponse } from '../utils/generic-ledger-utils';
import { isStacksLedgerAppClosed } from '../utils/stacks-ledger-utils';

interface RequiresChainProp {
  chain: SupportedBlockchains;
}

interface CommonLedgerInlineWarningsProps extends RequiresChainProp {
  latestDeviceResponse: LatestDeviceResponse;
  outdatedLedgerAppWarning?: boolean;
  incorrectAppOpened: boolean;
}

function OutdatedLedgerAppWarning({ chain }: RequiresChainProp) {
  return (
    <WarningLabel textAlign="left">
      Latest version of <Capitalize>{chain} app</Capitalize> required
      <styled.a href="ledgerlive://manager" textDecoration="underline">
        Update on Ledger Live to continue
      </styled.a>
    </WarningLabel>
  );
}

function LedgerDeviceLockedWarning({ chain }: RequiresChainProp) {
  return (
    <WarningLabel textAlign="left">
      Your Ledger is locked. Unlock it and open the {''}
      <Capitalize>{chain}</Capitalize>
      {''} app to continue.
    </WarningLabel>
  );
}

function LedgerIncorrectAppWarning({ chain }: RequiresChainProp) {
  return (
    <WarningLabel textAlign="left">
      Incorrect app is opened. Close it and open the {''}
      <Capitalize>{chain}</Capitalize>
      {''} app to continue.
    </WarningLabel>
  );
}

function LedgerAppClosedWarning({ chain }: RequiresChainProp) {
  return (
    <WarningLabel textAlign="left">
      The <Capitalize>{chain}</Capitalize> app appears to be closed on Ledger. Open it to continue.
    </WarningLabel>
  );
}

export function CommonLedgerDeviceInlineWarnings({
  chain,
  latestDeviceResponse,
  outdatedLedgerAppWarning = false,
  incorrectAppOpened,
}: CommonLedgerInlineWarningsProps) {
  if (outdatedLedgerAppWarning) {
    return <OutdatedLedgerAppWarning chain={chain} />;
  }
  if (latestDeviceResponse?.deviceLocked) return <LedgerDeviceLockedWarning chain={chain} />;
  if (incorrectAppOpened) return <LedgerIncorrectAppWarning chain={chain} />;
  if (latestDeviceResponse && isStacksLedgerAppClosed(latestDeviceResponse))
    return <LedgerAppClosedWarning chain={chain} />;
  return null;
}
