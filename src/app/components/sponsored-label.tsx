import { FiAlertCircle } from 'react-icons/fi';

import { HStack, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function SponsoredLabel(): React.JSX.Element {
  return (
    <Stack width="100%">
      <HStack
        alignItems="center"
        bg={token('colors.accent.background-secondary')}
        borderRadius="10px"
        height="48px"
        pl="space.04"
        _hover={{ cursor: 'pointer' }}
      >
        <FiAlertCircle
          // #4164 FIXME make sure hover on stack works OK
          color={token('colors.accent.action-primary-default')}
          size="16px"
        />
        <styled.span
          color={token('colors.accent.action-primary-default')}
          fontSize="12px"
          fontWeight="500"
        >
          This transaction is sponsored, so no fee is charged
        </styled.span>
      </HStack>
    </Stack>
  );
}
