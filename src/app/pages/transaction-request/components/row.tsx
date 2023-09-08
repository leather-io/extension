import { Stack, StackProps, styled } from 'leather-styles/jsx';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Caption } from '@app/components/typography';

import { PrincipalValue } from './principal-value';

interface RowProps extends StackProps {
  name?: string | React.JSX.Element | null;
  type?: string;
  value: string;
}

export function Row(props: RowProps): React.JSX.Element {
  const { name, type, value, ...rest } = props;

  return (
    <Stack gap="space.03" {...rest}>
      <SpaceBetween flexShrink={0}>
        {name && <Caption>{name}</Caption>}
        {type && <Caption>{type}</Caption>}
      </SpaceBetween>

      {type?.toLowerCase() === 'principal' ? (
        <PrincipalValue address={value} />
      ) : (
        <styled.span
          display="block"
          fontSize={2}
          fontWeight={500}
          lineHeight="1.6"
          wordBreak="break-all"
        >
          {value}
        </styled.span>
      )}
    </Stack>
  );
}
