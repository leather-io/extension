import { useLocation, useNavigate } from 'react-router-dom';

import { Grid } from 'leather-styles/jsx';

import type { CryptoCurrency } from '@leather.io/models';

import { analytics } from '@shared/utils/analytics';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { LoadingSpinner } from '@app/components/loading-spinner';
import {
  useActiveFiatProviders,
  useHasFiatProviders,
} from '@app/query/common/remote-config/remote-config.query';

import { FiatProviderItem } from './components/fiat-provider-item';
import { activeFiatProviderIcons, getProviderUrl } from './components/fiat-providers.utils';
import { ReceiveFundsItem } from './components/receive-funds-item';

interface FiatProvidersProps {
  address: string;
  route: string;
  symbol: CryptoCurrency;
}
export function FiatProvidersList(props: FiatProvidersProps) {
  const { address, route, symbol } = props;
  const navigate = useNavigate();
  const activeProviders = useActiveFiatProviders();
  const hasProviders = useHasFiatProviders();

  const location = useLocation();

  const goToProviderExternalWebsite = (provider: string, providerUrl: string) => {
    void analytics.track('select_buy_option', { provider });
    openInNewTab(providerUrl);
  };

  if (!hasProviders) return <LoadingSpinner />;

  return (
    <Grid
      columnGap="space.04"
      mt={{ base: 0, md: 'space.03' }}
      rowGap="space.04"
      gridTemplateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
    >
      <ReceiveFundsItem
        symbol={symbol}
        onReceive={() =>
          navigate(route, {
            state: { backgroundLocation: location },
          })
        }
      />
      {Object.entries(activeProviders).map(([providerKey, providerValue]) => {
        const providerUrl = getProviderUrl({
          address,
          hasFastCheckoutProcess: providerValue.hasFastCheckoutProcess,
          key: providerKey,
          name: providerValue.name,
          symbol,
        });

        return (
          <FiatProviderItem
            availableRegions={providerValue.availableRegions}
            hasFastCheckoutProcess={providerValue.hasFastCheckoutProcess}
            hasTradingFees={providerValue.hasTradingFees}
            icon={activeFiatProviderIcons[providerKey]}
            key={providerKey}
            onGoToProvider={() => goToProviderExternalWebsite(providerValue.name, providerUrl)}
            title={providerValue.name}
          />
        );
      })}
    </Grid>
  );
}
