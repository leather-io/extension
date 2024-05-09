import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentStcAvailableUnlockedBalance } from '@app/query/stacks/balance/stx-balance.hooks';

// TODO: Asset refactor: remove wrapper here
export function useStxCryptoCurrencyAssetBalance() {
  const availableUnlockedBalance = useCurrentStcAvailableUnlockedBalance();
  return createStacksCryptoCurrencyAssetTypeWrapper(availableUnlockedBalance.amount);
}
