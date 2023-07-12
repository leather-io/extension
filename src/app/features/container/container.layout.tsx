import { Flex, color } from '@stacks/ui';

interface ContainerLayoutProps {
  children: React.JSX.Element | React.JSX.Element[];
  header: React.JSX.Element | null;
}
export function ContainerLayout(props: ContainerLayoutProps) {
  const { children, header } = props;

  return (
    <Flex flexDirection="column" flexGrow={1} width="100%" background={color('bg')}>
      {header || null}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
