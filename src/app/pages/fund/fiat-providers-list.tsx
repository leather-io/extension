import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Grid } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';
import { RouteUrls } from '@shared/route-urls';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
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
  symbol: CryptoCurrencies;
}
export function FiatProvidersList(props: FiatProvidersProps) {
  const { address, symbol } = props;
  const navigate = useNavigate();
  const activeProviders = useActiveFiatProviders();
  const hasProviders = useHasFiatProviders();
  const analytics = useAnalytics();
  const location = useLocation();

  const routeToQr = useMemo(() => {
    switch (symbol) {
      case 'BTC':
        return RouteUrls.ReceiveBtc;
      case 'STX':
        return RouteUrls.ReceiveStx;
    }
  }, [symbol]);

  const goToProviderExternalWebsite = (provider: string, providerUrl: string) => {
    void analytics.track('select_buy_option', { provider });
    openInNewTab(providerUrl);
  };

  if (!hasProviders) return <LoadingSpinner />;

  return (
    <Grid
      columnGap="space.05"
      justifyContent="center"
      mt={['space.04', 'space.08']}
      py="0"
      px={['space.05', 'space.08']}
      rowGap="1.5rem"
      placeItems="center"
      gridTemplateColumns={[
        'repeat(1, 1fr)',
        'repeat(1, 1fr)',
        'repeat(2, 1fr)',
        'repeat(3, 1fr)',
        'repeat(4, 1fr)',
      ]}
      width="100%"
      maxWidth={['100%', '80rem']}
    >
      <ReceiveFundsItem
        symbol={symbol}
        onReceive={() =>
          navigate(routeToQr, {
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
