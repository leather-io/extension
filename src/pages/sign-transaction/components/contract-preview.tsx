import React from 'react';
import { color, DynamicColorCircle, Stack, StackProps } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { Caption, Title } from '@components/typography';

interface ContractPreviewProps extends StackProps {
  contractAddress: string;
  contractName: string;
  functionName?: string;
}

export function ContractPreview(props: ContractPreviewProps): JSX.Element {
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
        string={`${contractAddress}.${contractName}${functionName ? `::${functionName}` : ''}`}
        backgroundSize="100%"
      />
      <Stack spacing="base-tight">
        <Title as="h3" fontWeight="500">
          {functionName || contractName}
        </Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </Stack>
  );
}
