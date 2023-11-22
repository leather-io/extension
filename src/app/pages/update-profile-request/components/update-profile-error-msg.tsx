import { FiAlertTriangle } from 'react-icons/fi';

import { HStack } from 'leather-styles/jsx';

import { Caption } from '@app/ui/components/typography/caption';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    // #4476 TODO change this colour and migrate FiAlertTriangle
    <HStack alignItems="center" bg="#FCEEED" p="space.04" borderRadius="md">
      <FiAlertTriangle />
      <Caption color="error.label">{errorMessage}</Caption>
    </HStack>
  );
}
