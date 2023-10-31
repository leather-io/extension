import { DynamicColorCircle, Stack, StackProps, color } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { formatContractId } from '@app/common/utils';
import { Caption } from '@app/ui/components/typography/caption';
import { Title } from '@app/ui/components/typography/title';

interface ContractPreviewLayoutProps extends StackProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
}

export function ContractPreviewLayout(props: ContractPreviewLayoutProps) {
  const { contractAddress, contractName, functionName, ...rest } = props;

  return (
    <Stack
      p="base"
      borderRadius="12px"
      spacing="base"
      alignItems="center"
      isInline
      border="1px solid"
      borderColor={color('border')}
      _hover={
        rest.onClick
          ? {
              cursor: 'pointer',
            }
          : undefined
      }
      {...rest}
    >
      <DynamicColorCircle
        size="42px"
        position="relative"
        string={`${formatContractId(contractAddress, contractName)}${
          functionName ? `::${functionName}` : ''
        }`}
        backgroundSize="100%"
      />
      <Stack spacing="base-tight">
        <Title>{functionName || contractName}</Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </Stack>
  );
}
