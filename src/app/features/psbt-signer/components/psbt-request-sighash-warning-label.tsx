import { WarningLabel } from '@app/components/warning-label';
import { LeatherButton } from '@app/ui/components/button';

export function PsbtRequestSighashWarningLabel() {
  return (
    <WarningLabel title="Be careful with this transaction" width="100%">
      The details you see here are not guaranteed. Be sure to fully trust your counterparty, who can
      later modify this transaction to send or receive other assets from your account, and possibly
      even drain it.
      {/* TODO: Link for this? */}
      <LeatherButton display="inline" ml="space.01" textStyle="caption.02" variant="link">
        Learn more ↗
      </LeatherButton>
    </WarningLabel>
  );
}
