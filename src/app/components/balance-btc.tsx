import { formatMoney } from '@app/common/money/format-money';
import { Caption } from '@app/components/typography';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/bitcoin-balances.query';

export function BtcBalance() {
  const balance = useCurrentNativeSegwitAddressBalance();

  return <Caption variant="c2">{formatMoney(balance)}</Caption>;
}
