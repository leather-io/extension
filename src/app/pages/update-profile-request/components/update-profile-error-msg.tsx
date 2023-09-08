import { FiAlertTriangle } from 'react-icons/fi';

import { HStack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

interface ErrorMessageProps {
  errorMessage: string;
}
export function ErrorMessage(props: ErrorMessageProps) {
  const { errorMessage } = props;
  if (!errorMessage) return null;

  return (
    // // #4164 FIXME migrate bg="#FCEEED"
    <HStack alignItems="center" bg="#FCEEED" p="space.04" borderRadius="12px">
      <styled.span>
        <FiAlertTriangle color={token('colors.error')} strokeWidth={2} />
      </styled.span>
      <Caption color={token('colors.error')}>{errorMessage}</Caption>
    </HStack>
  );
}
