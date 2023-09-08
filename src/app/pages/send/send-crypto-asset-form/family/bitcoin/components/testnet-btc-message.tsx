import { ExternalLink } from '@app/components/external-link';
import { WarningLabel } from '@app/components/warning-label';

export function TestnetBtcMessage() {
  return (
    <WarningLabel mb="space.04">
      This is a Bitcoin testnet transaction. Funds have no value.{' '}
      <ExternalLink href="https://coinfaucet.eu/en/btc-testnet" textDecoration="underline">
        Get testnet BTC here ↗
      </ExternalLink>
    </WarningLabel>
  );
}
