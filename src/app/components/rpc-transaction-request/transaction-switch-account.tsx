import { Box, styled } from 'leather-styles/jsx';

import { Approver, Caption, ItemLayout, Pressable, SkeletonLoader } from '@leather.io/ui';
import { formatDustUsdAmounts, formatMoneyPadded, i18nFormatCurrency } from '@leather.io/utils';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { AccountBitcoinAddress } from '@app/components/account/account-bitcoin-address';
import { AccountNameLayout } from '@app/components/account/account-name';
import { useCurrentBtcCryptoAssetBalanceNativeSegwit } from '@app/query/bitcoin/balance/btc-balance-native-segwit.hooks';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { AccountAvatarItem } from '@app/ui/components/account/account-avatar/account-avatar-item';

interface TransactionSwitchAccountProps {
  toggleSwitchAccount(): void;
}
// TODO: Refactor to decouple from Bitcoin, create an 'editor' to switch accounts?
export function TransactionSwitchAccount({ toggleSwitchAccount }: TransactionSwitchAccountProps) {
  const index = useCurrentAccountIndex();
  const stacksAccounts = useStacksAccounts();
  const { balance, isLoading: isLoadingBalance } = useCurrentBtcCryptoAssetBalanceNativeSegwit();

  const convertToFiatAmount = useConvertCryptoCurrencyToFiatAmount('BTC');
  const fiatAmount = convertToFiatAmount(balance.availableBalance);

  const stxAddress = stacksAccounts[index]?.address || '';
  const { data: name = '', isLoading: isLoadingName } = useAccountDisplayName({
    address: stxAddress,
    index,
  });

  const titleRight = (
    <SkeletonLoader isLoading={isLoadingBalance} width="96px">
      <styled.span textStyle="label.02">{formatMoneyPadded(balance.availableBalance)}</styled.span>
    </SkeletonLoader>
  );

  const captionRight = (
    <SkeletonLoader isLoading={isLoadingBalance} width="48px">
      <Caption>{formatDustUsdAmounts(i18nFormatCurrency(fiatAmount))}</Caption>
    </SkeletonLoader>
  );

  return (
    <Approver.Section>
      <Approver.Subheader>With account</Approver.Subheader>
      <Box mb="space.03">
        <Pressable onClick={toggleSwitchAccount}>
          <ItemLayout
            showChevron
            img={<AccountAvatarItem index={0} publicKey="" name="" />}
            titleLeft={<AccountNameLayout isLoading={isLoadingName}>{name}</AccountNameLayout>}
            captionLeft={<AccountBitcoinAddress index={index} />}
            titleRight={titleRight}
            captionRight={captionRight}
          />
        </Pressable>
      </Box>
    </Approver.Section>
  );
}
