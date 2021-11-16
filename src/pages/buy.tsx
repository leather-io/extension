import React from 'react';
import { PopupContainer } from '@components/popup/container';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { Header } from '@components/header';
import { Caption, Text, Title } from '@components/typography';
import { Button, Flex, Stack } from '@stacks/ui';
import { Link } from '@components/link';
import { ScreenPaths } from '@common/types';
import AddFunds from '@assets/images/add-funds.svg';
import { SpaceBetween } from '@components/space-between';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { transakUrl } from '@common/transak-helper';

export const BuyPage = () => {
  const doChangeScreen = useChangeScreen();
  const currentAccount = useCurrentAccount();
  const TRANSAK_URL = transakUrl(currentAccount?.address);

  return (
    <PopupContainer
      header={
        <Header hideActions title=" " onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />
      }
      requestType="auth"
    >
      <Flex flexDirection="column" flex={1} mt={-8}>
        <Stack overflow="hidden" alignItems="flex-start" spacing="base-tight" padding="12px">
          <img src={AddFunds} />;<Title>Fund your account</Title>
          <Text fontSize="16px" mt={4}>
            When you use Stacks apps, you’ll pay a small fee in STX to the network. Fund your
            account by buying some STX on an exchange...
          </Text>
          <Link
            onClick={() => window.open('https://www.hiro.so', '_blank')}
            color="blue"
            fontSize="16px"
            display="flex"
          >
            Learn more about STX ↗
          </Link>
        </Stack>

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
              <Title marginBottom="10">Transak</Title>
              <Caption>
                Buy STX with your credit- or debit card. <br />
                Delivered straight to your Stacks account in less than 15 minutes.
              </Caption>
            </Stack>
          </SpaceBetween>
          <Button
            width="100%"
            mt={5}
            onClick={() => window.open(TRANSAK_URL, '_blank')}
            borderRadius="10px"
          >
            Buy on Transak ↗
          </Button>
        </Stack>
      </Flex>
    </PopupContainer>
  );
};
