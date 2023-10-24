import React from 'react';

import { styled } from 'leather-styles/jsx';

const StyledA = styled('a');

interface ExternalLinkProps extends React.ComponentProps<typeof StyledA> {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <styled.a target="_blank" cursor="pointer" href={href} {...rest}>
      {children}
    </styled.a>
  );
}
