import { Stack, StackProps } from '@stacks/ui';

import { AssetRow } from '@app/components/asset-row';
import { CollectibleAssets } from '@app/features/balances-list/components/collectible-assets';
import { useCurrentAccountBalancesUnanchoredState } from '@app/store/accounts/account.hooks';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useStxTokenState } from '@app/store/assets/asset.hooks';

import { FungibleAssets } from './components/fungible-assets';
import { NoAssets } from './components/no-assets';

export const BalancesList = (props: StackProps) => {
  const stxToken = useStxTokenState();
  const currentAccount = useCurrentAccount();
  const balances = useCurrentAccountBalancesUnanchoredState();

  if (!balances) return null;

  const noAssets =
    stxToken.balance.isEqualTo(0) &&
    Object.keys(balances.fungible_tokens).length === 0 &&
    Object.keys(balances.non_fungible_tokens).length === 0;

  if (noAssets && currentAccount?.address)
    return <NoAssets address={currentAccount.address} {...props} />;

  return (
    <Stack pb="extra-loose" spacing="extra-loose" {...props}>
      {stxToken && stxToken.balance.isGreaterThan(0) && <AssetRow asset={stxToken} />}
      <FungibleAssets />
      <CollectibleAssets spacing="extra-loose" />
    </Stack>
  );
};
