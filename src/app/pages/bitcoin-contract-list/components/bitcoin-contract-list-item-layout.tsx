import { useCallback } from 'react';

import { Flex, HStack, styled } from 'leather-styles/jsx';

import { useCryptoCurrencyMarketDataMeanAverage } from '@leather-wallet/query';
import { BitcoinContractIcon, Caption, Flag } from '@leather-wallet/ui';
import {
  baseCurrencyAmountInQuote,
  createMoneyFromDecimal,
  i18nFormatCurrency,
  satToBtc,
} from '@leather-wallet/utils';

import { useBitcoinExplorerLink } from '@app/common/hooks/use-bitcoin-explorer-link';

interface BitcoinContractListItemLayoutProps {
  id: string;
  state: string;
  collateralAmount: string;
  txid: string;
}
export function BitcoinContractListItemLayout({
  id,
  state,
  collateralAmount,
  txid,
}: BitcoinContractListItemLayoutProps) {
  const { handleOpenBitcoinTxLink: handleOpenTxLink } = useBitcoinExplorerLink();
  const bitcoinMarketData = useCryptoCurrencyMarketDataMeanAverage('BTC');

  const getFiatValue = useCallback(
    (value: string) =>
      i18nFormatCurrency(
        baseCurrencyAmountInQuote(createMoneyFromDecimal(Number(value), 'BTC'), bitcoinMarketData)
      ),
    [bitcoinMarketData]
  );

  return (
    <Flex
      mb="15px"
      onClick={() =>
        handleOpenTxLink({
          txid,
        })
      }
    >
      <Flag img={<BitcoinContractIcon />} spacing="space.04" width="100%">
        <HStack alignItems="center" justifyContent="space-between" width="100%">
          <styled.span textStyle="body.01">{id}</styled.span>
          <styled.span fontVariantNumeric="tabular-nums" textAlign="right" textStyle="body.01">
            {satToBtc(parseInt(collateralAmount)).toString()}
          </styled.span>
        </HStack>
        <HStack height="1.25rem" alignItems="center" justifyContent="space-between" width="100%">
          <Caption>{state}</Caption>
          <Caption>{getFiatValue(satToBtc(parseInt(collateralAmount)).toString())}</Caption>
        </HStack>
      </Flag>
    </Flex>
  );
}
