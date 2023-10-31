import { ReactNode } from 'react';

import { Flex, FlexProps, Stack, styled } from 'leather-styles/jsx';

interface InfoLabelProps extends FlexProps {
  children: ReactNode;
  title: string;
}
export function InfoLabel({ children, title, ...rest }: InfoLabelProps) {
  return (
    <Flex width="100%" {...rest}>
      <Stack
        alignItems="start"
        bg="disabled"
        borderRadius="10px"
        minHeight="48px"
        px="base"
        py="base-tight"
        gap="tight"
        width="100%"
        color="accent.notification-text"
      >
        <styled.span textStyle="label.02">{title}</styled.span>
        <styled.span textStyle="label.03">{children}</styled.span>
      </Stack>
    </Flex>
  );
}
