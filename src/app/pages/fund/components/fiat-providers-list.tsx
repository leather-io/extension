import { useNavigate } from 'react-router-dom';
import { Grid } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { LoadingSpinner } from '@app/components/loading-spinner';
import {
  useActiveFiatProviders,
  useHasFiatProviders,
} from '@app/query/hiro-config/hiro-config.query';
import { RouteUrls } from '@shared/route-urls';

import { FiatProviderItem } from './fiat-provider-item';
import { activeFiatProviderIcons, getProviderUrl } from './fiat-providers.utils';
import { ReceiveStxItem } from './receive-stx-item';

interface FiatProvidersProps {
  address: string;
}
export const FiatProvidersList = (props: FiatProvidersProps) => {
  const { address } = props;
  const navigate = useNavigate();
  const activeProviders = useActiveFiatProviders();
  const hasProviders = useHasFiatProviders();
  const analytics = useAnalytics();

  const goToProviderExternalWebsite = (provider: string, providerUrl: string) => {
    void analytics.track('select_buy_option', { provider });
    openInNewTab(providerUrl);
  };

  if (!hasProviders) return <LoadingSpinner />;

  return (
    <Grid
      columnGap="base-loose"
      justifyContent="center"
      mt={['base', '48px']}
      px={['loose', 'loose', '48px']}
      rowGap="loose"
      templateColumns="repeat(auto-fill, minmax(270px, 1fr))"
      width="100%"
    >
      <ReceiveStxItem onReceiveStx={() => navigate(RouteUrls.FundReceive)} />
      {Object.entries(activeProviders).map(([providerKey, providerValue]) => {
        const providerUrl = getProviderUrl(address, providerKey, providerValue.name);

        return (
          <FiatProviderItem
            key={providerKey}
            icon={activeFiatProviderIcons[providerKey]}
            onGoToProvider={() => goToProviderExternalWebsite(providerValue.name, providerUrl)}
            hasFastCheckoutProcess={providerValue.hasFastCheckoutProcess}
            hasTradingFees={providerValue.hasTradingFees}
            hasUnitedStatesAvailability={providerValue.hasUnitedStatesAvailability}
            title={providerValue.name}
          />
        );
      })}
    </Grid>
  );
};
