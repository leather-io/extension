// #4164 FIXME migrate useMediaQuery
import { useMediaQuery } from '@stacks/ui';
import { Flex, Stack } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { PageTitle } from '@app/components/page-title';

import { FiatProvidersList } from './components/fiat-providers-list';

interface FundLayoutProps {
  address: string;
}
export function FundLayout(props: FundLayoutProps) {
  const { address } = props;

  const [desktopViewport] = useMediaQuery(`(min-width: ${token('sizes.desktopViewportMinWidth')})`);

  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent="start"
      mb="space.05"
      {...props}
    >
      <Stack
        alignItems={['left', 'center']}
        pb={['space.05', 'unset']}
        px={['space.05', 'space.05', 'unset']}
        gap={['space.04', 'space.05']}
        mt={['space.04', 'unset']}
      >
        <PageTitle
          fontSize={['24px', '32px', '48px']}
          lineHeight={['150%', '125%']}
          maxWidth={['unset', 'unset', token('sizes.centeredPageFullWidth')]}
          px={['unset', 'loose']}
          textAlign={['left', 'center']}
        >
          {/* TODO: Investigate removing / refactoring <PageTitle */}
          <styled.h1 textStyle="heading.02">
            {desktopViewport ? 'Let’s get STX into your wallet' : 'Get STX'}
          </styled.h1>
        </PageTitle>
        <styled.span
          color={!desktopViewport ? 'unset' : 'accent.text-primary'}
          maxWidth="544px"
          textAlign={['left', 'center']}
        >
          <styled.span textStyle="label.02">
            Choose an exchange to fund your account with Stacks (STX) or deposit from elsewhere.
            Exchanges with “Fast checkout” make it easier to purchase STX for direct deposit into
            your wallet with a credit card.
          </styled.span>
        </styled.span>
      </Stack>
      <FiatProvidersList address={address} />
    </Flex>
  );
}
