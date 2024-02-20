import React from 'react';

import { toRelativeTime } from '@common/utils';
import type { ContractCallTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, Flex, styled } from 'leather-styles/jsx';

interface TxCardProps {
  tx: ContractCallTransaction;
  label: string;
}
export const TxCard: React.FC<TxCardProps> = ({ tx, label }) => {
  const addr = tx.sender_address;
  const shortAddr = `${addr.slice(0, 5)}...${addr.slice(addr.length - 6, addr.length - 1)}`;
  return (
    <Box
      flex="0 1 280px"
      mr="space.02"
      mt="space.03"
      border="default"
      borderRadius="xs"
      p="space.05"
      _hover={{
        cursor: 'pointer',
      }}
      onClick={() => {
        const url = `https://testnet-explorer.blockstack.org/txid/${tx.tx_id}`;
        window.open(url, '_blank');
      }}
    >
      <Flex>
        <Box>
          <styled.span color="ink.text-primary">{shortAddr}</styled.span>
        </Box>
        <Box flexGrow={1} textAlign="right">
          <styled.span color="ink.text-primary">
            {toRelativeTime(tx.burn_block_time * 1000)}
          </styled.span>
        </Box>
      </Flex>
      <styled.span display="block" textStyle="body.large" mt={3}>
        {label}
      </styled.span>
    </Box>
  );
};
