import { formatMoney } from '@app/common/money/format-money';
import { useCurrentNativeSegwitAddressBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { Caption } from '@app/ui/components/typography/caption';

export function BtcBalance() {
  const balance = useCurrentNativeSegwitAddressBalance();

  return <Caption>{formatMoney(balance)}</Caption>;
}
