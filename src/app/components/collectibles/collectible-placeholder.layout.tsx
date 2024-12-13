import { Flex } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';

export function CollectiblePlaceholderLayout({ children }: HasChildren) {
  return (
    <Flex
      alignItems="center"
      bg="ink.component-background-default"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      textAlign="center"
      width="100%"
    >
      {children}
    </Flex>
  );
}
