import { HStack, Stack, styled } from 'leather-styles/jsx';

import { ErrorCircleIcon } from '@app/ui/components/icons/error-circle-icon';

// #4476 TODO - visually inspect this
export function SponsoredLabel(): React.JSX.Element {
  return (
    <Stack width="100%">
      <HStack
        alignItems="center"
        bg="accent.component-background-hover"
        borderRadius="10px"
        height="48px"
        pl="base"
      >
        <ErrorCircleIcon color="stacks" size="16px" />

        <styled.span color="accent.text-primary">
          This transaction is sponsored, so no fee is charged
        </styled.span>
      </HStack>
    </Stack>
  );
}
