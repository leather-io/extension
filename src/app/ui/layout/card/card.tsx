import type { ReactNode } from 'react';

import { Flex, Stack, styled } from 'leather-styles/jsx';

interface CardProps {
  action?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  text?: string;
}

export function Card({ action, children, title, text }: CardProps) {
  return (
    <Flex direction="column">
      {(title || text) && (
        <Stack gap="space.05" px="space.05">
          {title}
          {text && <styled.p textStyle="label.02">{text}</styled.p>}
          {children}
        </Stack>
      )}
      {!title && children}
      {action}
    </Flex>
  );
}
