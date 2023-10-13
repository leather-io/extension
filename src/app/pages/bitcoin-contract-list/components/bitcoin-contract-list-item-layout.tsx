import { useCallback } from 'react';

import { Box, Flex } from '@stacks/ui';
import { HStack } from 'leather-styles/jsx';

import { createMoneyFromDecimal } from '@shared/models/money.model';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { baseCurrencyAmountInQuote } from '@app/common/money/calculate-money';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { satToBtc } from '@app/common/money/unit-conversion';
import { BitcoinContractIcon } from '@app/components/icons/bitcoin-contract-icon';
import { Flag } from '@app/components/layout/flag';
import { Caption, Text } from '@app/components/typography';
import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';

interface BitcoinContractListItemLayoutProps {
  id: string;
  state: string;
  collateralAmount: string;
  txId: string;
}
export function BitcoinContractListItemLayout({
  id,
  state,
  collateralAmount,
  txId,
}: BitcoinContractListItemLayoutProps) {
  const { handleOpenTxLink } = useExplorerLink();
  const bitcoinMarketData = useCryptoCurrencyMarketData('BTC');

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), bitcoinMarketData)
      ),
    [bitcoinMarketData]
  );

  return (
    <Flex
      as={'button'}
      marginBottom="15px"
      onClick={() =>
        handleOpenTxLink({
          blockchain: 'bitcoin',
          suffix: `&submitted=true`,
          txId,
        })
      }
    >
      <Flag img={<Box as={BitcoinContractIcon} />} align="middle" spacing="base" width="100%">
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <Text>{id}</Text>
          <Text fontVariantNumeric="tabular-nums" textAlign="right">
            {satToBtc(parseInt(collateralAmount)).toString()}
          </Text>
        </HStack>
        <HStack height="1.25rem" alignItems="center" justifyContent="space-between" width="100%">
          <Caption>{state}</Caption>
          <Caption>{getFiatValue(satToBtc(parseInt(collateralAmount)).toString())}</Caption>
        </HStack>
      </Flag>
    </Flex>
  );
}
