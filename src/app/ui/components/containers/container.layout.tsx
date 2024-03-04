import { radixBaseCSS } from '@radix-ui/themes/styles.css';
import { css } from 'leather-styles/css';
import { Flex } from 'leather-styles/jsx';

interface ContainerLayoutProps {
  children: React.JSX.Element | React.JSX.Element[];
  header: React.JSX.Element | null;
  variant: string;
}
export function ContainerLayout({ children, header, variant }: ContainerLayoutProps) {
  return (
    <Flex
      data-testid="main-container"
      flexDirection="column"
      flexGrow={1}
      width="100%"
      height="100%" // ??
      className={css(radixBaseCSS)}
      bg={variant !== 'home' ? 'ink.background-secondary' : undefined}
    >
      {header}
      <Flex className="main-content" flexGrow={1} position="relative" width="100%">
        {children}
      </Flex>
    </Flex>
  );
}
