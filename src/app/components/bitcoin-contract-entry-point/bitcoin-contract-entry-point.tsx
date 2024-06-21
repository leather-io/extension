import { useNavigate } from 'react-router-dom';

import { BitcoinContractIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { useGetBitcoinContractsBalance } from '@app/query/bitcoin/balance/bitcoin-contracts-balance.hooks';

import { BitcoinContractEntryPointLayout } from './bitcoin-contract-entry-point-layout';

export function BitcoinContractEntryPoint() {
  const navigate = useNavigate();

  const { bitcoinContractsBalance, bitcoinContractsBalanceInUSD, isLoading } =
    useGetBitcoinContractsBalance();

  function onClick() {
    navigate(RouteUrls.BitcoinContractList);
  }

  return (
    <BitcoinContractEntryPointLayout
      isLoading={isLoading}
      balance={bitcoinContractsBalance}
      caption={bitcoinContractsBalance.symbol}
      icon={<BitcoinContractIcon />}
      usdBalance={bitcoinContractsBalanceInUSD}
      onClick={onClick}
    />
  );
}
