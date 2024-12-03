import { BTC_DECIMALS } from '@leather.io/constants';
import { useCryptoCurrencyMarketDataMeanAverage, useSip10Token } from '@leather.io/query';
import { Avatar, BtcAvatarIcon, PlaceholderIcon } from '@leather.io/ui';
import { createMoney, getPrincipalFromContractId } from '@leather.io/utils';

import { castBitcoinMarketDataToSbtcMarketData } from '@app/common/hooks/use-calculate-sip10-fiat-value';
import { useBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCurrentAccountNativeSegwitIndexZeroSigner } from '@app/store/accounts/blockchain/bitcoin/native-segwit-account.hooks';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

export function useBtcSwapAsset() {
  const nativeSegwitSigner = useCurrentAccountNativeSegwitIndexZeroSigner();
  const currentBitcoinAddress = nativeSegwitSigner.address;
  const { balance } = useBtcCryptoAssetBalanceNativeSegwit(currentBitcoinAddress);
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  return {
    balance: balance.availableBalance,
    tokenId: 'token-btc',
    displayName: 'Bitcoin',
    fallback: 'BT',
    icon: <BtcAvatarIcon />,
    name: 'BTC',
    marketData: bitcoinMarketData,
    principal: '',
  };
}
// Testnet only
const tempContractIdForSBtcTesting =
  'SNGWPN3XDAQE673MXYXF81016M50NHF5X5PWWM70.sbtc-token::sbtc-token';

export function useSBtcSwapAsset() {
  const stxAddress = useCurrentStacksAccountAddress();
  const token = useSip10Token(stxAddress, tempContractIdForSBtcTesting);
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');
  return {
    balance: token?.balance.availableBalance ?? createMoney(0, 'sBTC', BTC_DECIMALS),
    tokenId: 'token-sbtc',
    displayName: 'sBTC',
    fallback: 'SB',
    icon: (
      <Avatar.Root>
        <Avatar.Icon>
          <PlaceholderIcon />
        </Avatar.Icon>
      </Avatar.Root>
    ),
    name: 'sBTC',
    marketData: castBitcoinMarketDataToSbtcMarketData(bitcoinMarketData),
    principal: getPrincipalFromContractId(token?.info.contractId ?? ''),
  };
}
