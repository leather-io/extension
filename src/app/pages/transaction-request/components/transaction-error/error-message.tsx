import { memo } from 'react';

import { Stack, StackProps, color } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';

import { ErrorIcon } from '@app/components/icons/error-icon';

interface ErrorMessageProps extends StackProps {
  title: string;
  body: string | React.JSX.Element;
  actions?: React.JSX.Element;
}
export const ErrorMessage = memo(({ title, body, actions, ...rest }: ErrorMessageProps) => {
  return (
    <Stack
      bg={color('bg')}
      border="4px solid #FCEEED"
      borderRadius="12px"
      spacing="extra-loose"
      mb="loose"
      p="loose"
      {...rest}
    >
      <Stack spacing="base-loose">
        <Stack alignItems="center" color={color('feedback-error')} isInline>
          <ErrorIcon />
          <styled.h1 textStyle="label.01">{title}</styled.h1>
        </Stack>
        <styled.span textStyle="caption.01">{body}</styled.span>
      </Stack>
      {actions && <Stack spacing="base-tight">{actions}</Stack>}
    </Stack>
  );
});
