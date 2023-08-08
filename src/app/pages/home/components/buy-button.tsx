import { Suspense } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ChainID } from '@stacks/transactions';
import { HomePageSelectorsLegacy } from '@tests-legacy/page-objects/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useHasFiatProviders } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

import { HomeActionButton } from './HomeActionButton';

export function BuyButton() {
  const navigate = useNavigate();
  const hasFiatProviders = useHasFiatProviders();
  const currentNetwork = useCurrentNetworkState();
  if (!hasFiatProviders) return null;
  if (currentNetwork.chain.stacks.chainId !== ChainID.Mainnet) return null;

  return (
    <Suspense
      fallback={
        <HomeActionButton
          data-testid={HomePageSelectorsLegacy.BtnFundAccount}
          icon={<FiPlus />}
          label="Buy"
          isDisabled
        />
      }
    >
      <HomeActionButton
        data-testid={HomePageSelectorsLegacy.BtnFundAccount}
        icon={<FiPlus />}
        label="Buy"
        onClick={() => navigate(RouteUrls.Fund)}
      />
    </Suspense>
  );
}
