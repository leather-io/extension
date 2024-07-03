import { Flex } from 'leather-styles/jsx';

interface ContainerLayoutProps {
  content?: React.JSX.Element | React.JSX.Element[];
  header: React.JSX.Element | null;
}
export function ContainerLayout({ content, header }: ContainerLayoutProps) {
  return (
    <Flex
      data-testid="main-container"
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height={{ base: '100vh', sm: '100%' }}
    >
      {header}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {content}
      </Flex>
    </Flex>
  );
}
