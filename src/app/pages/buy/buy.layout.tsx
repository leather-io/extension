import { color, Stack } from '@stacks/ui';

import AddFunds from '@assets/images/add-funds.svg';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPage } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Header } from '@app/components/header';
import { PrimaryButton } from '@app/components/primary-button';
import { Caption, Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { ActiveFiatProviderType } from '@app/query/hiro-config/hiro-config.query';
import { fullPageContent, fullPageTitle, popupPageTitle } from '@app/pages/pages.styles';

const providersInfo = {
  transak: {
    title: 'Transak',
    body: 'Non-US residents can purchase STX with credit card, debit card, or bank transfer via Transak.',
    cta: 'Buy on Transak',
  },
  okcoin: {
    title: 'Okcoin',
    body: 'US users can purchase STX quickly with USD',
    cta: 'Buy on Okcoin',
  },
};

interface ProvidersUrl {
  transak: string;
  okcoin: string;
}

interface ProviderLayoutProps {
  provider: string;
  providerUrl: string;
}
const ProviderLayout = ({ provider, providerUrl }: ProviderLayoutProps) => {
  const { title, cta, body } = providersInfo[provider as keyof ProvidersUrl];
  return (
    <Stack overflow="hidden" alignItems="flex-start" spacing="base" mt={5} className="buy-box">
      <Stack spacing="base-tight">
        <Title marginBottom="10">{title}</Title>
        <Caption>{body}</Caption>
      </Stack>
      <PrimaryButton onClick={() => openInNewTab(providerUrl)}>{cta}</PrimaryButton>
    </Stack>
  );
};

interface BuyLayoutProps {
  onCloseAction: () => void;
  providersUrl: ProvidersUrl;
  activeProviders: Record<string, ActiveFiatProviderType>;
}
export const BuyLayout = (props: BuyLayoutProps) => {
  const { providersUrl, activeProviders, onCloseAction } = props;

  useRouteHeader(<Header hideActions title=" " onClose={onCloseAction} />);

  return (
    <Stack
      alignItems="flex-start"
      className={isFullPage ? fullPageContent : undefined}
      overflow="hidden"
      spacing="base"
    >
      <img src={AddFunds} />
      <Title
        className={isFullPage ? fullPageTitle : popupPageTitle}
        mt="base-tight"
        textAlign="left"
        width="100%"
      >
        Fund your account
      </Title>
      <Text>
        You'll need STX to pay for transaction fees and other interactions with the Stacks
        blockchain. Choose an option below to purchase and deposit STX directly into your account.
      </Text>
      <Link
        color={color('accent')}
        fontSize="16px"
        onClick={() => openInNewTab('https://hiro.so/questions/wallet-stx-purchases')}
      >
        Learn more ↗
      </Link>
      {Object.keys(activeProviders).map(provider => (
        <ProviderLayout
          key={provider}
          provider={provider}
          providerUrl={providersUrl[provider as keyof ProvidersUrl]}
        />
      ))}
    </Stack>
  );
};
