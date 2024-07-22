import { Flex, FlexProps } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

/** @deprecated TODO: only used in Dialogs so should move to monorepo/ui/dialog */
export function Footer({ children, ...props }: HasChildren & FlexProps) {
  return (
    <Flex
      gap="space.05"
      p="space.05"
      bottom={0}
      width="100vw"
      maxWidth="100%"
      zIndex={1}
      minHeight="footerHeight"
      position="fixed"
      borderBottomRadius="md"
      bg="ink.background-primary"
      borderTop="default"
      {...props}
    >
      {children}
    </Flex>
  );
}
