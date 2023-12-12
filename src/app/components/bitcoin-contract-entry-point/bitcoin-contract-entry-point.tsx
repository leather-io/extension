import { useNavigate } from 'react-router-dom';

import { RouteUrls } from '@shared/route-urls';

import { useBitcoinContractsBalanceQuery } from '@app/query/stacks/balance/bitcoin-contracts-balance.query';
import { BitcoinContractIcon } from '@app/ui/components/icons/bitcoin-contract-icon';

import { useCryptoCurrencyMarketData } from '@app/query/common/market-data/market-data.hooks';
import { createMoney } from '@shared/models/money.model';
import { BitcoinContractEntryPointLayout } from './bitcoin-contract-entry-point-layout';

export function BitcoinContractEntryPoint() {
  const navigate = useNavigate();

  const { data: bitcoinContactsBalance, isLoading, refetch } = useBitcoinContractsBalanceQuery();


  function onClick() {
    navigate(RouteUrls.BitcoinContractList);
  }

  return (
      <BitcoinContractEntryPointLayout
        isLoading={isLoading}
        balance={bitcoinContactsBalance ? bitcoinContactsBalance : createMoney(0, 'BTC')}
        caption={bitcoinContactsBalance ? bitcoinContactsBalance.symbol : 'BTC'}
        icon={<BitcoinContractIcon />}
        // usdBalance={btcUsdBalance}
        onClick={onClick}
      />
    )
}
