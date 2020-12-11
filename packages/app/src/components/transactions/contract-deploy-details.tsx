import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex, CodeBlock } from '@stacks/ui';
// import { Divider } from '@components/divider';
import { truncateMiddle } from '@stacks/ui-utils';
import { useWallet } from '@common/hooks/use-wallet';
import Prism from 'prismjs';
import { clarity } from '@common/clarity-prism';
import 'prismjs/components/prism-json';
clarity(Prism);

export const ContractDeployDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  const { currentIdentity } = useWallet();
  if (!pendingTransaction || pendingTransaction.txType !== 'smart_contract') {
    return null;
  }
  return (
    <>
      <Box mt="base">
        <Text fontWeight="500" display="block">
          Contract Deploy Details
        </Text>
      </Box>
      <Box>
        <Flex dir="column" flexWrap="wrap" width="100%">
          <Box mt="base" width="100%">
            <Flex my="base">
              <Box flexGrow={1}>
                <Text display="block">Contract Address</Text>
                <Text textStyle="caption" color="ink.600">
                  Principal
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} color="ink.600" title={currentIdentity.getStxAddress()}>
                  {truncateMiddle(currentIdentity.getStxAddress())}
                </Text>
              </Box>
            </Flex>
            <Flex my="base">
              <Box flexGrow={1}>
                <Text display="block">Contract Name</Text>
                <Text textStyle="caption" color="ink.600">
                  String
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} color="ink.600" title={pendingTransaction.contractName}>
                  {truncateMiddle(pendingTransaction.contractName)}
                </Text>
              </Box>
            </Flex>
            <Flex my="base" dir="column">
              <Box mb="base">
                <Text display="block">Contract Code</Text>
              </Box>
              <CodeBlock code={pendingTransaction.codeBody} Prism={Prism as any} />
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
