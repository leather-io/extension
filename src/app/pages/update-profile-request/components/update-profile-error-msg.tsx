import { HStack } from 'leather-styles/jsx';

import { ErrorIcon } from '@app/ui/components/icons/error-icon';
import { Caption } from '@app/ui/components/typography/caption';

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
