import { Flex } from '@stacks/ui';

interface ContainerLayoutProps {
  children: JSX.Element | JSX.Element[];
  header: JSX.Element | null;
}
export function ContainerLayout(props: ContainerLayoutProps) {
  const { children, header } = props;

  return (
    <Flex flexDirection="column" flexGrow={1} width="100%" position="relative" zIndex={1}>
      {header || null}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
