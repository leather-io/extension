import { useState } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import {
  BitcoinContractListItem,
  useBitcoinContracts,
} from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { truncateMiddle } from '@app/ui/utils/truncate-middle';

import { BitcoinContractListItemLayout } from './components/bitcoin-contract-list-item-layout';
import { BitcoinContractListLayout } from './components/bitcoin-contract-list-layout';

export function BitcoinContractList() {
  const { getAllActiveBitcoinContracts } = useBitcoinContracts();
  const [bitcoinContracts, setBitcoinContracts] = useState<BitcoinContractListItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useOnMount(() => {
    const fetchAndFormatBitcoinContracts = async () => {
      const fetchedBitcoinContracts = await getAllActiveBitcoinContracts();
      if (!fetchedBitcoinContracts) {
        setError(true);
        setLoading(false);
        return;
      }
      setBitcoinContracts(fetchedBitcoinContracts);
      setLoading(false);
    };
    void fetchAndFormatBitcoinContracts();
  });

  if (isLoading) return <FullPageLoadingSpinner />;

  return (
    <BitcoinContractListLayout>
      {bitcoinContracts.length === 0 || isError ? (
        <Flex width="100%" height="100vh" alignItems="center" justifyContent="center">
          <styled.span textAlign="center" textStyle="body.01">
            {isError
              ? 'Bitcoin Contracts are not available currently'
              : "You don't have any open Bitcoin Contracts."}
          </styled.span>
        </Flex>
      ) : (
        bitcoinContracts.map(bitcoinContract => {
          return (
            <BitcoinContractListItemLayout
              key={bitcoinContract.id}
              id={truncateMiddle(bitcoinContract.id)}
              collateralAmount={bitcoinContract.acceptorCollateral}
              txid={bitcoinContract.txId}
              state={bitcoinContract.state}
            />
          );
        })
      )}
    </BitcoinContractListLayout>
  );
}
