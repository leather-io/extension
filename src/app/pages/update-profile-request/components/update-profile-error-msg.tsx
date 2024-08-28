import { HStack } from 'leather-styles/jsx';

import { Caption, ErrorTriangleIcon } from '@leather.io/ui';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    <HStack alignItems="center" bg="#FCEEED" p="space.04" borderRadius="md">
      <ErrorTriangleIcon />
      <Caption color="red.action-primary-default">{errorMessage}</Caption>
    </HStack>
  );
}
