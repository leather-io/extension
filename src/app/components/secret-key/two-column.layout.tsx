import { Flex, Stack, styled } from 'leather-styles/jsx';

interface TwoColumnLayoutProps {
  leftColumn: React.JSX.Element;
  rightColumn: React.JSX.Element;
}

export function TwoColumnLayout({
  leftColumn,
  rightColumn,
}: TwoColumnLayoutProps): React.JSX.Element {
  return (
    <Flex
      flexDirection={['column', 'column', 'column', 'row']}
      paddingTop="space.06"
      px={['space.05', 'space.00']}
      gap="space.05"
      width={['100%', 'unset']}
    >
      <Flex
        alignItems={['center', 'center', 'center', 'flex-start']}
        textAlign={['center', 'center', 'center', 'left']}
        flexDirection="column"
        padding="space.00"
        gap="space.07"
        width={['100%', 'centeredPageFullWidth']}
        mx={['auto', 'auto', 'auto', 'unset']}
      >
        <styled.div maxWidth="440px">{leftColumn}</styled.div>
      </Flex>

      <Flex
        gap="space.05"
        alignItems={['center', 'center', 'center', 'flex-start']}
        flexDirection="column"
        px={['space.00', 'space.08', 'space.08', 'space.02']}
        width={['100%', '600px']}
      >
        <Stack
          px={['space.00', 'space.05']}
          pt={['space.02', 'space.05']}
          pb={['space.02', 'space.05']}
          gap="space.04"
          backgroundColor="accent.background-primary"
          borderRadius="8px"
          width="100%"
          flex="1"
        >
          {rightColumn}
        </Stack>
      </Flex>
    </Flex>
  );
}
