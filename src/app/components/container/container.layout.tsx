import { Flex, color } from '@stacks/ui';

interface ContainerLayoutProps {
  children: JSX.Element | JSX.Element[];
  header: JSX.Element | null;
}
export function ContainerLayout(props: ContainerLayoutProps) {
  const { children, header } = props;

  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
      width="100%"
      background={color('bg')}
      minHeight="100vh"
      maxHeight="100vh"
      position="relative"
      overflow="auto"
    >
      {header || null}
      <Flex
        flexDirection="column"
        flexGrow={1}
        className="main-content"
        as="main"
        position="relative"
        width="100%"
        px="loose"
        pb="loose"
      >
        {children}
      </Flex>
    </Flex>
  );
}
