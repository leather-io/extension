import { HStack, Stack } from 'leather-styles/jsx';

import { Caption, Title } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

interface ContractDetailsProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
  onClick?(): void;
}

export function ContractDetails({
  contractAddress,
  contractName,
  functionName,
  onClick,
}: ContractDetailsProps) {
  return (
    <HStack _hover={onClick ? { cursor: 'pointer' } : undefined} gap="space.04" onClick={onClick}>
      <Stack gap="space.03">
        <Title>{functionName || contractName}</Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </HStack>
  );
}
