import { useState } from 'react';
import { useAsync } from 'react-async-hook';
import { useNavigate } from 'react-router-dom';

import { Box } from '@stacks/ui';

import { Money, createMoneyFromDecimal } from '@shared/models/money.model';
import { RouteUrls } from '@shared/route-urls';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { useCalculateBitcoinFiatValue } from '@app/query/common/market-data/market-data.hooks';
import { BitcoinContractIcon } from '@app/ui/components/icons/bitcoin-contract-icon';

import { BitcoinContractEntryPointLayout } from './bitcoin-contract-entry-point-layout';

interface BitcoinContractEntryPointProps {
  btcAddress: string;
}
export function BitcoinContractEntryPoint({ btcAddress }: BitcoinContractEntryPointProps) {
  const navigate = useNavigate();
  const { sumBitcoinContractCollateralAmounts } = useBitcoinContracts();
  const [isLoading, setIsLoading] = useState(true);
  const calculateFiatValue = useCalculateBitcoinFiatValue();
  const [bitcoinContractSum, setBitcoinContractSum] = useState<Money>(
    createMoneyFromDecimal(0, 'BTC')
  );

  useAsync(async () => {
    setIsLoading(true);
    const currentBitcoinContractSum = await sumBitcoinContractCollateralAmounts();
    if (!currentBitcoinContractSum) return;
    setBitcoinContractSum(currentBitcoinContractSum);
    setIsLoading(false);
  }, [btcAddress]);

  function onClick() {
    navigate(RouteUrls.BitcoinContractList);
  }

  return (
    !bitcoinContractSum.amount.isZero() && (
      <BitcoinContractEntryPointLayout
        isLoading={isLoading}
        balance={bitcoinContractSum}
        caption={bitcoinContractSum.symbol}
        icon={<Box as={BitcoinContractIcon} />}
        usdBalance={i18nFormatCurrency(calculateFiatValue(bitcoinContractSum))}
        onClick={onClick}
      />
    )
  );
}
