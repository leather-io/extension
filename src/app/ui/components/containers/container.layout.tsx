import { Flex } from 'leather-styles/jsx';

interface ContainerLayoutProps {
  children: React.JSX.Element | React.JSX.Element[];
  header: React.JSX.Element | null;
}
export function ContainerLayout({ children, header }: ContainerLayoutProps) {
  return (
    <Flex
      id="main-container"
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height={{ base: '100vh', sm: '100%' }}
      minHeight="100vh"
    >
      {header}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
