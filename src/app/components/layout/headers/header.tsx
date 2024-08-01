import { type BoxProps, styled } from 'leather-styles/jsx';

import type { HasChildren } from '@app/common/has-children';

export function Header({ children, ...props }: HasChildren & BoxProps) {
  return (
    <styled.header
      justifyContent="center"
      margin={{ base: 0, md: 'auto' }}
      p="space.04"
      bg="transparent"
      maxWidth={{ base: '100vw', md: 'fullPageMaxWidth' }}
      width="100%"
      {...props}
    >
      {children}
    </styled.header>
  );
}
