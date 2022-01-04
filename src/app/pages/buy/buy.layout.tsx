import { cx } from '@emotion/css';
import { color, Stack } from '@stacks/ui';

import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPage, isPopup } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { fullPageContent, fullPageTitle, popupPageTitle } from '@app/pages/pages.styles';
import AddFunds from '@assets/images/add-funds.svg';

interface BuyLayoutProps {
  onCloseAction: () => void;
  onrampProviders: JSX.Element;
}
export const BuyLayout = (props: BuyLayoutProps) => {
  const { onCloseAction, onrampProviders } = props;

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
        className={cx({ [fullPageTitle]: isFullPage }, { [popupPageTitle]: isPopup })}
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
      {onrampProviders}
    </Stack>
  );
};
