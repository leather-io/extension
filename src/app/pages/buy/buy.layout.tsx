import { Box, color, Stack } from '@stacks/ui';

import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Text } from '@app/components/typography';
import { Link } from '@app/components/link';
import { PageTitle } from '@app/components/page-title';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import AddFunds from '@assets/images/add-funds.png';

interface BuyLayoutProps {
  onCloseAction: () => void;
  onrampProviders: JSX.Element;
}
export const BuyLayout = (props: BuyLayoutProps) => {
  const { onCloseAction, onrampProviders } = props;
  const analytics = useAnalytics();

  useRouteHeader(<Header hideActions title=" " onClose={onCloseAction} />);

  const goToLearnMore = () => {
    void analytics.track('select_buy_learn_more');
    openInNewTab('https://hiro.so/questions/wallet-stx-purchases');
  };

  return (
    <CenteredPageContainer>
      <Stack
        maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH}
        pb={['loose', 'unset']}
        px={['loose', 'unset']}
        spacing="base"
      >
        <Box display={['none', 'block']} width={['100px', '115px']}>
          <img src={AddFunds} />
        </Box>
        <PageTitle mt={['unset', 'base']}>Buy STX quickly</PageTitle>
        <Text>
          Easily purchase Stacks (STX) with your credit card or other method for direct deposit into
          your Hiro Wallet account.
        </Text>
        <Link color={color('accent')} fontSize="16px" onClick={() => goToLearnMore()}>
          Learn more ↗
        </Link>
        {onrampProviders}
      </Stack>
    </CenteredPageContainer>
  );
};
