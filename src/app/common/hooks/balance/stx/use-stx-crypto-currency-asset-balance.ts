import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';

export function useStxCryptoCurrencyAssetBalance() {
  const { availableBalance: availableStxBalance } = useStxBalance();
  return createStacksCryptoCurrencyAssetTypeWrapper(availableStxBalance.amount);
}
