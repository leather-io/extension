import { useStxBalance } from '@app/common/hooks/balance/stx/use-stx-balance';
import { useNativeSegwitBalance } from '@app/query/bitcoin/balance/btc-native-segwit-balance.hooks';
import { createStacksCryptoCurrencyAssetTypeWrapper } from '@app/query/stacks/balance/stacks-ft-balances.utils';
import { useCurrentAccountNativeSegwitSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';

export function useBtcCryptoCurrencyAssetBalance() {
  const currentBtcSigner = useCurrentAccountNativeSegwitSigner();
  // TODO: it would be better if we could skip providing the empty string to this hook.
  const bitcoinBalance = useNativeSegwitBalance(currentBtcSigner?.(0).address ?? '');

  if (!currentBtcSigner?.(0).address) return undefined;
  return bitcoinBalance;
}

export function useStxCryptoCurrencyAssetBalance() {
  const { availableBalance: availableStxBalance } = useStxBalance();
  return createStacksCryptoCurrencyAssetTypeWrapper(availableStxBalance.amount);
}
