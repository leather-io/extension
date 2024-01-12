import { memo } from 'react';

import { HStack, Stack, styled } from 'leather-styles/jsx';

import { ErrorIcon } from '@app/ui/components/icons/error-icon';

interface ErrorMessageProps {
  title: string;
  body: string | React.JSX.Element;
  actions?: React.JSX.Element;
  border?: string;
  borderColor?: string;
}
export const ErrorMessage = memo(({ border, title, body, actions }: ErrorMessageProps) => {
  return (
    <Stack
      bg="accent.background-primary"
      border={border ? border : 'active'}
      borderRadius="sm"
      gap="space.06"
      mb="space.05"
      p="space.05"
    >
      <Stack gap="space.04">
        <HStack alignItems="center" color="error.label">
          <ErrorIcon />
          <styled.h1 textStyle="label.01">{title}</styled.h1>
        </HStack>
        <styled.span textStyle="caption.01">{body}</styled.span>
      </Stack>
      {actions && <Stack gap="space.03">{actions}</Stack>}
    </Stack>
  );
});
