import { Caption, DynamicColorCircle, Title } from '@leather-wallet/ui';
import { truncateMiddle } from '@leather-wallet/utils';
import { HStack, Stack } from 'leather-styles/jsx';

import { formatContractId } from '@app/common/utils';

interface ContractPreviewLayoutProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
  onClick?(): void;
}

export function ContractPreviewLayout({
  contractAddress,
  contractName,
  functionName,
  onClick,
}: ContractPreviewLayoutProps) {
  return (
    <HStack
      p="space.04"
      borderRadius="sm"
      gap="space.04"
      alignItems="center"
      border="default"
      _hover={
        onClick
          ? {
              cursor: 'pointer',
            }
          : undefined
      }
    >
      <DynamicColorCircle
        size="42px"
        position="relative"
        value={`${formatContractId(contractAddress, contractName)}${
          functionName ? `::${functionName}` : ''
        }`}
        backgroundSize="100%"
      />
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
