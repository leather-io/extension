import { Flex, color } from '@stacks/ui';

interface ContainerLayoutProps {
  children: JSX.Element | JSX.Element[];
  header: JSX.Element | null;
}
export function ContainerLayout(props: ContainerLayoutProps) {
  const { children, header } = props;

  return (
    <Flex flexDirection="column" flexGrow={1} width="100%" background={color('bg')}>
      {header || null}
      <Flex
        className="main-content"
        flexDirection="column"
        flexGrow={1}
        pb="loose"
        position="relative"
        width="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
}
