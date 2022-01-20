import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { Flex, Stack } from '@stacks/ui';

import AddFunds from '@assets/images/add-funds.svg';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';

interface BuyLayoutProps {
  onCloseAction: () => void;
  onrampProviders: JSX.Element;
}

export const BuyLayout = (props: BuyLayoutProps) => {
  const { onCloseAction, onrampProviders } = props;

  useRouteHeader(<Header hideActions title=" " onClose={onCloseAction} />);

  return (
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
      {onrampProviders}
    </Flex>
  );
};
