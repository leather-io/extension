import { memo } from 'react';

import { HStack, Stack, StackProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ErrorIcon } from '@app/components/icons/error-icon';

interface ErrorMessageProps extends StackProps {
  title: string;
  body: string | React.JSX.Element;
  actions?: React.JSX.Element;
}
export const ErrorMessage = memo(({ title, body, actions, ...rest }: ErrorMessageProps) => {
  return (
    <Stack
      bg={token('colors.accent.background-primary')}
      border="4px solid #FCEEED"
      borderRadius="12px"
      gap="space.06"
      mb="space.05"
      p="space.05"
      {...rest}
    >
      <Stack gap="base-loose">
        <HStack alignItems="center" color={token('colors.error')}>
          <ErrorIcon />
          <styled.h1 textStyle="label.01">{title}</styled.h1>
        </HStack>
        <styled.span textStyle="caption.01">{body}</styled.span>
      </Stack>
      {actions && <Stack gap="space.03">{actions}</Stack>}
    </Stack>
  );
});
