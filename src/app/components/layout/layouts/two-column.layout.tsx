import { ReactNode } from 'react';

import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

interface TwoColumnLayoutProps {
  title: ReactNode;
  content: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  wideChild?: boolean;
}

export function TwoColumnLayout({
  title,
  content,
  action,
  children,
  wideChild,
}: TwoColumnLayoutProps): React.JSX.Element {
  return (
    <Flex
      flexDirection={{ base: 'column', md: 'row' }}
      pt="space.06"
      px={{ base: 'space.05', md: 'space.00' }}
      mx={{ base: 'auto', md: 'space.03', lg: 'space.06' }}
      gap="space.05"
      width={{ base: '100vw', md: 'unset' }}
    >
      <Flex flexDirection="column" gap="space.04">
        <Stack gap="space.04">
          <styled.h1 textStyle="heading.03">{title}</styled.h1>
          <styled.p textStyle="label.02">{content}</styled.p>
          <Box mt="space.04">{action}</Box>
        </Stack>
      </Flex>

      <Flex gap="space.05" flexDirection="column" mb={{ base: 'space.05', md: '0' }}>
        <Stack
          p={{ base: 'space.02', md: 'space.05' }}
          gap="space.04"
          bg="ink.background-primary"
          border="default"
          borderRadius="lg"
          width="100%"
          minWidth={{
            base: '100%',
            md: '400px',
            lg: wideChild ? 'twoColumnPageWidth' : 'pageWidth',
          }}
          flex="1"
        >
          {children}
        </Stack>
      </Flex>
    </Flex>
  );
}
