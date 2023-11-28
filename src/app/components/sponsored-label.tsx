import { HStack, Stack, styled } from 'leather-styles/jsx';

import { ErrorCircleIcon } from '@app/ui/components/icons/error-circle-icon';

// #4476 TODO - visually inspect this
export function SponsoredLabel(): React.JSX.Element {
  return (
    <Stack width="100%">
      <HStack
        alignItems="center"
        bg="accent.component-background-hover"
        borderRadius="sm"
        height="48px"
        pl="space.04"
      >
        <ErrorCircleIcon color="stacks" size="sm" />

        <styled.span color="accent.text-primary">
          This transaction is sponsored, so no fee is charged
        </styled.span>
      </HStack>
    </Stack>
  );
}
