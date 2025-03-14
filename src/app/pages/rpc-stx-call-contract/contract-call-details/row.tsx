import { HStack, Stack, styled } from 'leather-styles/jsx';

import { Caption } from '@leather.io/ui';

import { PrincipalValue } from './principal-value';

interface RowProps {
  name?: string | React.JSX.Element | null;
  type?: string;
  value: string;
}
export function Row({ name, type, value }: RowProps) {
  return (
    <Stack gap="space.03">
      <HStack alignItems="center" flexShrink={0} justifyContent="space-between">
        {name && <Caption>{name}</Caption>}
        {type && <Caption>{type}</Caption>}
      </HStack>
      {type?.toLowerCase() === 'principal' ? (
        <PrincipalValue address={value} />
      ) : (
        <styled.span display="block" textStyle="body.02" wordBreak="break-all">
          {value}
        </styled.span>
      )}
    </Stack>
  );
}
