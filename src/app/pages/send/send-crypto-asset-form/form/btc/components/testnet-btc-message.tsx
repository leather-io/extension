import { color } from '@stacks/ui-utils';

import { ExternalLink } from '@app/components/external-link';
import { WarningLabel } from '@app/components/warning-label';

export function TestnetBtcMessage() {
  return (
    <WarningLabel mt="base-loose" width="100%">
      This is a Bitcoin testnet transaction. Funds have no value.{' '}
      <ExternalLink
        href="https://coinfaucet.eu/en/btc-testnet"
        color={color('text-body')}
        textDecoration="underline"
      >
        Get testnet BTC here ↗
      </ExternalLink>
    </WarningLabel>
  );
}
