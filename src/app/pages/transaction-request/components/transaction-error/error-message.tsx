import { memo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Box, color, Stack, StackProps } from '@stacks/ui';

import { Caption, Text } from '@app/components/typography';

interface ErrorMessageProps extends StackProps {
  title: string;
  body: string | JSX.Element;
  actions?: JSX.Element;
}
export const ErrorMessage = memo(({ title, body, actions, ...rest }: ErrorMessageProps) => {
  return (
    <Stack
      mt="loose"
      p="loose"
      borderRadius="12px"
      border="4px solid #FCEEED"
      spacing="extra-loose"
      color={color('feedback-error')}
      bg={color('bg')}
      {...rest}
    >
      <Stack spacing="base-loose">
        <Stack alignItems="center" isInline>
          <Box strokeWidth={2} as={FiAlertTriangle} />
          <Text color="currentColor">{title}</Text>
        </Stack>
        <Caption color={color('text-body')}>{body}</Caption>
      </Stack>
      {actions && <Stack spacing="base-tight">{actions}</Stack>}
    </Stack>
  );
});
