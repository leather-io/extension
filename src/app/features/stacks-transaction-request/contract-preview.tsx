import { HStack, Stack, StackProps } from 'leather-styles/jsx';

import { formatContractId } from '@app/common/utils';
import { color } from '@app/common/utils/stacks-ui/ui/colors';
import { DynamicColorCircle } from '@app/common/utils/stacks-ui/ui/dynamic-color-circle';
import { truncateMiddle } from '@app/common/utils/stacks-ui/ui/truncateMiddle';
import { Caption, Title } from '@app/components/typography';

interface ContractPreviewLayoutProps extends StackProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
}

export function ContractPreviewLayout(props: ContractPreviewLayoutProps) {
  const { contractAddress, contractName, functionName, ...rest } = props;

  return (
    <HStack
      p="base"
      borderRadius="12px"
      gap="base"
      alignItems="center"
      border="1px solid"
      borderColor={color('border')}
      _hover={
        rest.onClick
          ? {
              cursor: 'pointer',
            }
          : undefined
      }
      // {...rest} FIXME - check this ...rest to fix type
    >
      <DynamicColorCircle
        size="42px"
        position="relative"
        string={`${formatContractId(contractAddress, contractName)}${
          functionName ? `::${functionName}` : ''
        }`}
        backgroundSize="100%"
      />
      <Stack gap="base-tight">
        <Title as="h3" fontWeight="500">
          {functionName || contractName}
        </Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </HStack>
  );
}
