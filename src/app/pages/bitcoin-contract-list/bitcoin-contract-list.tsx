import { useEffect } from 'react';
import { useState } from 'react';

import { Transaction } from 'bitcoinjs-lib';

import { initialBitcoinContracts } from '@shared/models/initial-bitcoin-contracts';

// import useBitcoinContracts from '@app/common/hooks/use-bitcoin-contracts';
import { LoadingSpinner } from '@app/components/loading-spinner';

import { BitcoinContractListItemLayout } from './components/bitcoin-contract-list-item-layout';
import { BitcoinContractListLayout } from './components/bitcoin-contract-list-layout';

interface BitcoinContractListItemObject {
  ID: string;
  collateralAmount: number;
  txID: string;
}

export function BitcoinContractList() {
  // const bitcoinContractsInterface = useBitcoinContracts();
  const [bitcoinContracts, setBitcoinContracts] = useState<BitcoinContractListItemObject[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitcoinContracts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual call to wasm wallet interface
        // const fetchedBitcoinContracts = await bitcoinContractsInterface.getAllContracts();
        const formattedBitcoinContracts = formatBitcoinContracts(initialBitcoinContracts);
        setBitcoinContracts(formattedBitcoinContracts);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBitcoinContracts();
  }, []);

  const formatBitcoinContracts = (
    bitcoinContracts: Record<string, any>[]
  ): BitcoinContractListItemObject[] => {
    return bitcoinContracts.map(bitcoinContract => {
      return {
        ID: bitcoinContract.id,
        collateralAmount: bitcoinContract.contractInfo.totalCollateral,
        txID: Transaction.fromHex(bitcoinContract.dlcTransactions.fund).getId(),
      };
    });
  };

  if (isLoading) return <LoadingSpinner height="600px"/>;

  return (
    <BitcoinContractListLayout>
      {bitcoinContracts.map(bitcoinContract => {
        return (
          <BitcoinContractListItemLayout
            key={bitcoinContract.ID}
            collateralAmount={bitcoinContract.collateralAmount}
            txID={bitcoinContract.txID}
          />
        );
      })}
    </BitcoinContractListLayout>
  );
}
