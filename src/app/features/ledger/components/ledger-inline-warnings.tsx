import { styled } from 'leather-styles/jsx';

import type { SupportedBlockchains } from '@leather.io/models';
import { Callout } from '@leather.io/ui';

import { Capitalize } from '@app/ui/utils/capitalize';

import { LatestDeviceResponse } from '../utils/generic-ledger-utils';
import { isStacksLedgerAppClosed } from '../utils/stacks-ledger-utils';

interface RequiresChainProp {
  chain: SupportedBlockchains;
}

interface CommonLedgerInlineWarningsProps extends RequiresChainProp {
  latestDeviceResponse: LatestDeviceResponse;
  outdatedLedgerAppWarning?: boolean;
}

function OutdatedLedgerAppWarning({ chain }: RequiresChainProp) {
  return (
    <Callout variant="warning" textAlign="left">
      Latest version of <Capitalize>{chain} app</Capitalize> required
      <styled.a href="ledgerlive://manager" textDecoration="underline">
        Update on Ledger Live to continue
      </styled.a>
    </Callout>
  );
}

function LedgerDeviceLockedWarning({ chain }: RequiresChainProp) {
  return (
    <Callout variant="warning" textAlign="left">
      Your Ledger is locked. Unlock it and open the {''}
      <Capitalize>{chain}</Capitalize>
      {''} app to continue.
    </Callout>
  );
}

function LedgerAppClosedWarning({ chain }: RequiresChainProp) {
  return (
    <Callout variant="warning" textAlign="left">
      The <Capitalize>{chain}</Capitalize> app appears to be closed on Ledger. Open it to continue.
    </Callout>
  );
}

export function CommonLedgerDeviceInlineWarnings({
  chain,
  latestDeviceResponse,
  outdatedLedgerAppWarning = false,
}: CommonLedgerInlineWarningsProps) {
  if (!latestDeviceResponse) return null;

  if (outdatedLedgerAppWarning) {
    return <OutdatedLedgerAppWarning chain={chain} />;
  }
  if (latestDeviceResponse.deviceLocked) return <LedgerDeviceLockedWarning chain={chain} />;
  if (isStacksLedgerAppClosed(latestDeviceResponse))
    return <LedgerAppClosedWarning chain={chain} />;
  return null;
}
