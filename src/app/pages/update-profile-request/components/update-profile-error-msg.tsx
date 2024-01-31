import { HStack } from 'leather-styles/jsx';

import { Caption } from '@app/ui/components/typography/caption';
import { ErrorIcon } from '@app/ui/icons/error-icon';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    <HStack alignItems="center" bg="#FCEEED" p="space.04" borderRadius="md">
      <ErrorIcon />
      <Caption color="error.label">{errorMessage}</Caption>
    </HStack>
  );
}
