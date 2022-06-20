import { memo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { ChainID } from '@stacks/transactions';
import { ButtonProps } from '@stacks/ui';

import { useHasFiatProviders } from '@app/query/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/network/networks.hooks';
import { RouteUrls } from '@shared/route-urls';
import { HomePageSelectors } from '@tests/page-objects/home.selectors';

import { HomeActionButton } from './tx-button';
import { SecondaryButton } from '@app/components/secondary-button';

function BuyTxButton(props: ButtonProps) {
  return (
    <HomeActionButton
      data-testid={HomePageSelectors.BtnFundAccount}
      icon={FiPlus}
      label="Buy"
      buttonComponent={SecondaryButton}
      {...props}
    />
  );
}

const BuyButtonFallback = memo(() => <BuyTxButton isDisabled />);

export const BuyButton = () => {
  const navigate = useNavigate();
  const hasFiatProviders = useHasFiatProviders();
  const currentNetwork = useCurrentNetworkState();
  if (!hasFiatProviders) return null;
  if (currentNetwork.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton onClick={() => navigate(RouteUrls.Fund)} />
    </Suspense>
  );
};
