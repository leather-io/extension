import { Flex, Stack, styled } from 'leather-styles/jsx';

import { FiatProvidersList } from './components/fiat-providers-list';

interface FundLayoutProps {
  address: string;
}
export function FundLayout({ address }: FundLayoutProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent="start"
      mb="loose"
    >
      <Stack
        alignItems={['left', 'center']}
        pb={['space.05', 'unset']}
        px={['space.05', 'space.05', 'unset']}
        gap={['space.04', 'space.05']}
        mt={['space.04', 'unset']}
      >
        <styled.h1 px={['unset', 'space.05']} textAlign={['left', 'center']} textStyle="heading.02">
          Let's get funds into your wallet
        </styled.h1>

        <styled.span textStyle="label.02" maxWidth="544px" textAlign={['left', 'center']}>
          Choose an exchange to fund your account with Stacks (STX) or deposit from elsewhere.
          Exchanges with “Fast checkout” make it easier to purchase STX for direct deposit into your
          wallet with a credit card.
        </styled.span>
      </Stack>
      <FiatProvidersList address={address} />
    </Flex>
  );
}
