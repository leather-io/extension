import { WarningLabel } from '@app/components/warning-label';
import { Link } from '@app/ui/components/link/link';

/**
 * @deprecated
 * To be replaced with design system `Callout` component when ready
 */
export function TestnetBtcMessage() {
  return (
    <WarningLabel mb="space.04">
      This is a Bitcoin testnet transaction. Funds have no value.{' '}
      <Link href="https://coinfaucet.eu/en/btc-testnet">Get testnet BTC here ↗</Link>
    </WarningLabel>
  );
}
