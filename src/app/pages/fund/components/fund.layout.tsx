import { Stack, styled } from 'leather-styles/jsx';

import type { Blockchain, CryptoCurrency } from '@leather.io/models';

import { HasChildren } from '@app/common/has-children';

interface FundLayoutProps extends HasChildren {
  blockchain: Blockchain;
  symbol: CryptoCurrency;
}
export function FundLayout({ blockchain, symbol, children }: FundLayoutProps) {
  return (
    <Stack
      alignItems={{ base: 'left', md: 'center' }}
      p={{ base: 'space.05', md: 'unset' }}
      gap={{ base: 'space.04', md: 'space.05' }}
    >
      <styled.h1
        textAlign={{ base: 'left', md: 'center' }}
        color="ink.text-primary"
        textStyle={{ base: 'heading.03', md: 'display.02' }}
      >
        Let's get {symbol} <br />
        into your wallet
      </styled.h1>

      <styled.span
        textStyle="body.01"
        color="ink.text-primary"
        maxWidth="544px"
        textAlign={{ base: 'left', md: 'center' }}
      >
        Choose an exchange to fund your account with{' '}
        <styled.span textTransform="capitalize">{blockchain}</styled.span> ({symbol}) or deposit
        from elsewhere. Exchanges with “Fast checkout” make it easier to purchase {symbol} for
        direct deposit into your wallet with a credit card.
      </styled.span>
      {children}
    </Stack>
  );
}
