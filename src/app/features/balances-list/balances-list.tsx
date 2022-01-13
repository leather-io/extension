import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, StackProps } from '@stacks/ui';

import { AssetRow } from '@app/components/asset-row';
import { CollectibleAssets } from '@app/features/balances-list/components/collectible-assets';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';
import { useStxTokenState } from '@app/store/assets/asset.hooks';
import { RouteUrls } from '@shared/route-urls';

import { FungibleAssets } from './components/fungible-assets';
import { NoAssets } from './components/no-assets';

interface BalancesListProps extends StackProps {
  address: string;
}
export const BalancesList = ({ address, ...props }: BalancesListProps) => {
  const stxToken = useStxTokenState(address);
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  const navigate = useNavigate();

  const handleFundAccount = useCallback(() => navigate(RouteUrls.Buy), [navigate]);

  if (!balances) return null;

  const noAssets =
    stxToken.balance.isEqualTo(0) &&
    Object.keys(balances.fungible_tokens).length === 0 &&
    Object.keys(balances.non_fungible_tokens).length === 0;

  if (noAssets) return <NoAssets onFundAccount={handleFundAccount} {...props} />;

  return (
    <Stack pb="extra-loose" spacing="extra-loose" {...props}>
      {stxToken && stxToken.balance.isGreaterThan(0) && <AssetRow asset={stxToken} />}
      <FungibleAssets />
      <CollectibleAssets spacing="extra-loose" />
    </Stack>
  );
};
