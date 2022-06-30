import React from 'react';
import { Text, BoxProps, color } from '@stacks/ui';

interface ExternalLinkProps extends BoxProps {
  href: string;
  children: React.ReactNode;
}
export function ExternalLink(props: ExternalLinkProps) {
  return (
    <Text as="a" color={color('accent')} target="_blank" {...props}>
      {props.children}
    </Text>
  );
}
