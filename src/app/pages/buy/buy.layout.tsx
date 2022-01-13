import { Box, color, Stack } from '@stacks/ui';

import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Text } from '@app/components/typography';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import AddFunds from '@assets/images/add-funds.png';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

interface BuyLayoutProps {
  onCloseAction: () => void;
  onrampProviders: JSX.Element;
}
export const BuyLayout = (props: BuyLayoutProps) => {
  const { onCloseAction, onrampProviders } = props;

  useRouteHeader(<Header hideActions title=" " onClose={onCloseAction} />);

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        pb={['loose', 'unset']}
        px={['loose', 'unset']}
        spacing="base"
      >
        <Box width={['100px', '115px']}>
          <img src={AddFunds} />
        </Box>
        <PageTitle fontSize={[4, 8]} mt={['unset', 'base']}>
          Fund your account
        </PageTitle>
        <Text>
          Fund your account with STX, the native currency of Stacks. You can use your STX to trade,
          bid in auctions, earn Bitcoin, and much more. Buy some STX on an exchange to get started.
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
    </CenteredPageContainer>
  );
};
