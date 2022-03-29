import { Stack } from '@stacks/ui';

import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Caption, Title } from '@app/components/typography';
import { PrimaryButton } from '@app/components/primary-button';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { BuyTokensSelectors } from '@tests/page-objects/buy-tokens-selectors';

const providersInfo = {
  moonpay: {
    title: 'MoonPay',
    body: 'US and Non-US residents can purchase STX with credit card, debit card, bank transfer, Apple pay or Google pay via MoonPay.',
    cta: 'Buy on MoonPay',
    test_id: 'BtnMoonPay',
  },
  okcoin: {
    title: 'Okcoin',
    body: 'Non-US residents can purchase STX with credit card, debit card, or bank transfer via Okcoin.',
    cta: 'Buy on Okcoin',
    test_id: 'BtnOkCoin',
  },
  transak: {
    title: 'Transak',
    body: 'US and Non-US residents can purchase STX with credit card, debit card, or bank transfer via Transak.',
    cta: 'Buy on Transak',
    test_id: 'BtnTransak',
  },
};

export interface ProvidersUrl {
  moonpay: string;
  okcoin: string;
  transak: string;
}

interface OnrampProviderLayoutProps {
  provider: string;
  providerUrl: string;
}

export const OnrampProviderLayout = ({ provider, providerUrl }: OnrampProviderLayoutProps) => {
  const { title, cta, body, test_id } = providersInfo[provider as keyof ProvidersUrl];
  const analytics = useAnalytics();
  const goToProviderWebsite = () => {
    void analytics.track('select_buy_option', { provider });
    openInNewTab(providerUrl);
  };
  return (
    <Stack overflow="hidden" alignItems="flex-start" spacing="base" mt={5} className="buy-box">
      <Stack spacing="base-tight">
        <Title marginBottom="10">{title}</Title>
        <Caption>{body}</Caption>
      </Stack>
      <PrimaryButton
        onClick={goToProviderWebsite}
        data-testid={BuyTokensSelectors[test_id as keyof typeof BuyTokensSelectors]}
      >
        {cta}
      </PrimaryButton>
    </Stack>
  );
};
