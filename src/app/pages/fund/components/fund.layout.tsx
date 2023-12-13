import { Flex, Stack, styled } from 'leather-styles/jsx';

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
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent="start"
      mb="space.05"
    >
      <Stack
        alignItems={['left', 'center']}
        pb={['space.04', 'unset']}
        px={['space.05', 'space.05', 'unset']}
        gap={['space.04', 'space.05']}
      >
        <styled.h1
          px={['unset', 'space.05']}
          textAlign={['left', 'center']}
          textStyle={['heading.03', 'heading.02']}
        >
          Let's get funds into your wallet
        </styled.h1>

        <styled.span
          textStyle="body.01"
          color="accent.text-subdued"
          maxWidth="544px"
          textAlign={['left', 'center']}
        >
          Choose an exchange to fund your account with {name} ({nameAbbr}) or deposit from
          elsewhere. Exchanges with “Fast checkout” make it easier to purchase {nameAbbr} for direct
          deposit into your wallet with a credit card.
        </styled.span>
      </Stack>
      {children}
    </Flex>
  );
}
