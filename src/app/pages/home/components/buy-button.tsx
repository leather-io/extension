import { Suspense, memo } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests-legacy/page-objects/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { SecondaryButton } from '@app/components/secondary-button';
import { useHasFiatProviders } from '@app/query/common/hiro-config/hiro-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { HomeActionButton } from './tx-button';

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
  if (currentNetwork.chain.stacks.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense fallback={<BuyButtonFallback />}>
      <BuyTxButton onClick={() => navigate(RouteUrls.Fund)} />
    </Suspense>
  );
};
