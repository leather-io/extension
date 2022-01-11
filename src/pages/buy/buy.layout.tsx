import React from 'react';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { Caption, Text, Title } from '@components/typography';
import { Button, Flex, Stack } from '@stacks/ui';
import { Link } from '@components/link';
import AddFunds from '@assets/images/add-funds.svg';
import { SpaceBetween } from '@components/space-between';
import { openInNewTab } from '@common/utils/open-in-new-tab';
import { ActiveFiatProviderType } from '@query/hiro-config/hiro-config.query';

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
    <Stack
      overflow="hidden"
      alignItems="flex-start"
      spacing="base-tight"
      padding="24px"
      mt={5}
      className="buy-box"
    >
      <SpaceBetween flexGrow={1}>
        <Stack spacing="base-tight">
          <Title marginBottom="10">{title}</Title>
          <Caption>{body}</Caption>
        </Stack>
      </SpaceBetween>
      <Button width="100%" mt={5} onClick={() => openInNewTab(providerUrl)} borderRadius="10px">
        {cta}
      </Button>
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

  return (
    <PopupContainer
      header={<Header hideActions title=" " onClose={onCloseAction} />}
      requestType="auth"
    >
      <Flex flexDirection="column" flex={1}>
        <Stack overflow="hidden" alignItems="flex-start" spacing="base-tight">
          <img src={AddFunds} />
          <Title>Fund your account</Title>
          <Text fontSize="16px" mt="base-tight">
            You'll need STX to pay for transaction fees and other interactions with the Stacks
            blockchain. account by buying some STX on an exchange.
          </Text>
          <Text fontSize="16px" mt="none">
            Choose an option below to purchase and deposit STX directly into your account.
          </Text>
          <Link
            onClick={() => openInNewTab('https://hiro.so/questions/wallet-stx-purchases')}
            color="blue"
            fontSize="16px"
            display="flex"
          >
            Learn more ↗
          </Link>
        </Stack>
        {Object.keys(activeProviders).map(provider => (
          <ProviderLayout
            key={provider}
            provider={provider}
            providerUrl={providersUrl[provider as keyof ProvidersUrl]}
          />
        ))}
      </Flex>
    </PopupContainer>
  );
};
