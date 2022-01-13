import { memo, Suspense } from 'react';
import { FiPlus } from 'react-icons/fi';
import { ChainID } from '@stacks/transactions';
import { ButtonProps } from '@stacks/ui';

import { useHasFiatProviders } from '@app/query/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { RouteUrls } from '@shared/route-urls';
import { BuyTokensSelectors } from '@tests/page-objects/buy-tokens-selectors';

import { TxButton } from './tx-button';

const BuyTxButton = (props: ButtonProps) => (
  <TxButton
    data-testid={BuyTokensSelectors.BtnBuyTokens}
    icon={FiPlus}
    route={RouteUrls.Buy}
    type="Buy"
    {...props}
  />
);

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const hasFiatProviders = useHasFiatProviders();
  const currentNetwork = useCurrentNetworkState();
  if (!hasFiatProviders) return null;
  if (currentNetwork.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton />
    </Suspense>
  );
};
