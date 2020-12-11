import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex } from '@stacks/ui';
import { Divider } from '@components/divider';
import { truncateMiddle } from '@stacks/ui-utils';
import {
  deserializeCV,
  cvToString,
  ClarityType,
  getCVTypeString,
} from '@blockstack/stacks-transactions';

interface ArgumentProps {
  arg: string;
  name: string;
}
const Argument: React.FC<ArgumentProps> = ({ arg, name }) => {
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);
  const getCVString = () => {
    if (argCV.type === ClarityType.PrincipalStandard) {
      return truncateMiddle(strValue);
    }
    return strValue;
  };
  return (
    <Box mt="base" width="100%">
      <Flex>
        <Box flexGrow={1}>
          <Text display="block">{name}</Text>
          <Text textStyle="caption" color="ink.600">
            {getCVTypeString(argCV)}
          </Text>
        </Box>
        <Box>
          <Text fontSize={1} color="ink.600" title={strValue}>
            {getCVString()}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export const ContractCallDetails: React.FC = () => {
  const { pendingTransaction, contractInterface } = useTxState();
  if (!pendingTransaction || pendingTransaction.txType !== 'contract_call' || !contractInterface) {
    return null;
  }
  const selectedFunction = contractInterface.functions.find(func => {
    return func.name === pendingTransaction.functionName;
  });
  if (!selectedFunction) {
    return null;
  }

  const args = pendingTransaction.functionArgs.map((arg, index) => {
    const funcArg = selectedFunction.args[index];
    return <Argument key={funcArg.name} arg={arg} name={funcArg.name} />;
  });
  return (
    <>
      <Box my="base">
        <Text fontWeight="500" display="block">
          Contract
        </Text>
        <Text fontSize={1} color="blue">
          {truncateMiddle(pendingTransaction.contractAddress)}.{pendingTransaction.contractName}
        </Text>
      </Box>
      <Divider />
      <Box my="base">
        <Text fontWeight="500" display="block">
          Function
        </Text>
        <Text fontSize={1}>{pendingTransaction.functionName}</Text>
      </Box>
      <Divider />
      <Box mt="base">
        <Text fontWeight="500" display="block">
          Arguments
        </Text>
      </Box>
      <Box>
        <Flex dir="column" flexWrap="wrap" width="100%">
          {args}
        </Flex>
      </Box>
    </>
  );
};
