import { memo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { Box, Stack, StackProps, color } from '@stacks/ui';

import { Caption, Text } from '@app/components/typography';

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
      color={color('feedback-error')}
      spacing="extra-loose"
      mb="loose"
      p="loose"
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
