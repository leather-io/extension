import { useState } from 'react';

import { Flex } from 'leather-styles/jsx';

import { useBitcoinContracts } from '@app/common/hooks/use-bitcoin-contracts';
import { BitcoinContractListItem } from '@app/common/hooks/use-bitcoin-contracts';
import { useOnMount } from '@app/common/hooks/use-on-mount';
import { truncateMiddle } from '@app/common/utils/stacks-ui/ui/truncateMiddle';
import { FullPageLoadingSpinner } from '@app/components/loading-spinner';
import { Text } from '@app/components/typography';

import { BitcoinContractListItemLayout } from './components/bitcoin-contract-list-item-layout';
import { BitcoinContractListLayout } from './components/bitcoin-contract-list-layout';

export function BitcoinContractList() {
  const { getAllSignedBitcoinContracts } = useBitcoinContracts();
  const [bitcoinContracts, setBitcoinContracts] = useState<BitcoinContractListItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  useOnMount(() => {
    const fetchAndFormatBitcoinContracts = async () => {
      const fetchedBitcoinContracts = await getAllSignedBitcoinContracts();
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
          <Text textAlign="center">
            {isError
              ? 'Bitcoin Contracts are not available currently'
              : "You don't have any open Bitcoin Contracts."}
          </Text>
        </Flex>
      ) : (
        bitcoinContracts.map(bitcoinContract => {
          return (
            <BitcoinContractListItemLayout
              key={bitcoinContract.id}
              id={truncateMiddle(bitcoinContract.id)}
              collateralAmount={bitcoinContract.acceptorCollateral}
              txId={bitcoinContract.txId}
              state={bitcoinContract.state}
            />
          );
        })
      )}
    </BitcoinContractListLayout>
  );
}
