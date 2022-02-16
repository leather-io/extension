import { WarningLabel } from '@app/components/warning-label';
import { isStacksLedgerAppClosed } from '../ledger-utils';

interface LedgerInlineWarningsProps {
  latestDeviceResponse: any;
}
export function LedgerInlineWarnings({ latestDeviceResponse }: LedgerInlineWarningsProps) {
  if (!latestDeviceResponse) return null;
  if (latestDeviceResponse.deviceLocked)
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        Your Ledger is locked. Unlock it and open the Stacks app to continue.
      </WarningLabel>
    );
  if (isStacksLedgerAppClosed(latestDeviceResponse))
    return (
      <WarningLabel fontSize="14px" textAlign="left">
        The Stacks app appears to be closed on Ledger. Open it to continue.
      </WarningLabel>
    );
  return null;
}
