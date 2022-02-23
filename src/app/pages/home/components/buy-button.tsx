import { memo, Suspense } from 'react';
import { ChainID } from '@stacks/transactions';
import { useHasFiatProviders } from '@app/query/hiro-config/hiro-config.query';
import { BuyTxButton } from './tx-button';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { BuyTokensSelectors } from '@tests/page-objects/buy-tokens-selectors';

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const hasFiatProviders = useHasFiatProviders();
  const currentNetwork = useCurrentNetworkState();
  if (!hasFiatProviders) return null;
  if (currentNetwork.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton data-testid={BuyTokensSelectors.BtnBuyTokens} />
    </Suspense>
  );
};
