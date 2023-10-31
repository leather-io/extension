import { FiAlertTriangle } from 'react-icons/fi';

import { Box, Stack, color } from '@stacks/ui';

import { Caption } from '@app/ui/components/typography/caption';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    <Stack alignItems="center" bg="#FCEEED" p="base" borderRadius="12px" isInline>
      <Box color={color('feedback-error')} strokeWidth={2} as={FiAlertTriangle} />
      <Caption color={color('feedback-error')}>{errorMessage}</Caption>
    </Stack>
  );
}
