import { Stack, styled } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { HasChildren } from '@app/common/has-children';

const nameMap: Record<CryptoCurrencies, { name: string; symbol: string }> = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  STX: {
    name: 'Stacks',
    symbol: 'STX',
  },
};

interface FundLayoutProps extends HasChildren {
  symbol: CryptoCurrencies;
}

export function FundLayout({ symbol, children }: FundLayoutProps) {
  const name = nameMap[symbol].name;
  const nameAbbr = nameMap[symbol].symbol;
  return (
    <Stack
      alignItems={{ base: 'left', md: 'center' }}
      p={{ base: 'space.05', md: 'unset' }}
      gap={{ base: 'space.04', md: 'space.05' }}
      maxWidth="fullPageMaxWidth"
    >
      <styled.h1
        textAlign={{ base: 'left', md: 'center' }}
        color="ink.text-primary"
        textStyle={{ base: 'heading.03', md: 'display.02' }}
      >
        Let's get BTC <br />
        into your wallet
      </styled.h1>

      <styled.span
        textStyle="body.01"
        color="ink.text-primary"
        maxWidth="544px"
        textAlign={{ base: 'left', md: 'center' }}
      >
        Choose an exchange to fund your account with {name} ({nameAbbr}) or deposit from elsewhere.
        Exchanges with “Fast checkout” make it easier to purchase {nameAbbr} for direct deposit into
        your wallet with a credit card.
      </styled.span>
      {children}
    </Stack>
  );
}
