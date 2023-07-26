import { Text } from '@stacks/ui';

import { WarningLabel } from '@app/components/warning-label';

export function PsbtRequestSighashWarningLabel() {
  return (
    <WarningLabel title="Be careful with this transaction" width="100%">
      The details you see here are not guaranteed. Be sure to fully trust your counterparty, who can
      later modify this transaction to send or receive other assets from your account, and possibly
      even drain it.
      <Text display="inline" pl="extra-tight" textDecoration="underline">
        Learn more↗
      </Text>
    </WarningLabel>
  );
}
