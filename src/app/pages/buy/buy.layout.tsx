import { cx } from '@emotion/css';
import { Box, color, Stack } from '@stacks/ui';

import { Header } from '@app/components/header';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { isFullPage, isPopup } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { fullPageTitle, popupPageTitle } from '@app/pages/pages.styles';
import AddFunds from '@assets/images/add-funds.svg';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { FULL_PAGE_MAX_WIDTH } from '@shared/styles-constants';

interface BuyLayoutProps {
  onCloseAction: () => void;
  onrampProviders: JSX.Element;
}
export const BuyLayout = (props: BuyLayoutProps) => {
  const { onCloseAction, onrampProviders } = props;

  useRouteHeader(<Header hideActions title=" " onClose={onCloseAction} />);

  return (
    <CenteredPageContainer>
      <Stack maxWidth={`${FULL_PAGE_MAX_WIDTH}px`} pb="loose" spacing="base">
        <Box width={['100px', '115px']}>
          <img src={AddFunds} />
        </Box>
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
    </CenteredPageContainer>
  );
};
