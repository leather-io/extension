import { isFullPage, isPopup } from '@app/common/utils';
import { Flex, color } from '@stacks/ui';
import { fullPageContainer, popupCenterContainer, popupContainer } from './container.styles';

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
        className={isFullPage ? fullPageContainer : isPopup ? popupContainer : popupCenterContainer}
        flexGrow={1}
        pb="loose"
        position="relative"
        px="loose"
        width="100%"
      >
        {children}
      </Flex>
    </Flex>
  );
}
