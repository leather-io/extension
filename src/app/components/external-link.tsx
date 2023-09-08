import React from 'react';

import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  textDecoration?: string;
}
export function ExternalLink({ href, children, textDecoration = 'none' }: ExternalLinkProps) {
  return (
    <styled.a
      color={token('colors.accent.action-primary-default')}
      href={href}
      target="_blank"
      textDecoration={textDecoration}
    >
      {children}
    </styled.a>
  );
}
