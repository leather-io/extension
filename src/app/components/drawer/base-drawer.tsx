import { ReactNode, Suspense, memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, FlexProps } from 'leather-styles/jsx';

import { noop } from '@shared/utils';

import { useEventListener } from '@app/common/hooks/use-event-listener';
import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';

import { DrawerHeader } from './components/drawer-header';

function useDrawer(isShowing: boolean, onClose: () => void, pause?: boolean) {
  const ref = useRef(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isShowing && e.key === 'Escape') {
        onClose();
      }
    },
    [onClose, isShowing]
  );

  useOnClickOutside(ref, !pause && isShowing ? onClose : null);
  useEventListener('keydown', handleKeyDown);

  return ref;
}

interface BaseDrawerProps extends Omit<FlexProps, 'title'> {
  children?: ReactNode;
  enableGoBack?: boolean;
  icon?: React.JSX.Element;
  isShowing: boolean;
  isWaitingOnPerformedAction?: boolean;
  onClose?(): void;
  pauseOnClickOutside?: boolean;
  title?: string;
  waitingOnPerformedActionMessage?: string;
}
export const BaseDrawer = memo((props: BaseDrawerProps) => {
  const {
    children,
    enableGoBack,
    icon,
    isShowing,
    isWaitingOnPerformedAction,
    onClose,
    pauseOnClickOutside,
    title,
    waitingOnPerformedActionMessage,
    ...rest
  } = props;
  const ref = useDrawer(isShowing, onClose ? onClose : noop, pauseOnClickOutside);
  const navigate = useNavigate();

  const onGoBack = () => navigate(-1);

  return (
    <Flex
      display={isShowing ? 'flex' : 'none'}
      bg="overlay"
      transition="transition"
      position="fixed"
      top={0}
      left={0}
      height="100%"
      pt="space.05"
      width="100%"
      alignItems={['flex-end', 'center', 'center']}
      justifyContent="center"
      flexDirection="column"
      zIndex={1000}
      style={{
        pointerEvents: !isShowing ? 'none' : 'unset',
        userSelect: !isShowing ? 'none' : 'unset',
        willChange: 'background',
      }}
      {...rest}
    >
      <Flex
        flexDirection="column"
        flexGrow={0}
        ref={ref}
        opacity={isShowing ? 1 : 0}
        transform={isShowing ? 'none' : 'translateY(35px)'}
        transition={isShowing ? 'transition' + ' 0.1s' : 'transition'}
        transitionDuration="0.4s"
        willChange="transform, opacity"
        width="100%"
        maxWidth={['768px', '768px', '472px']}
        bg="accent.background-primary"
        borderTopLeftRadius="lg"
        borderTopRightRadius="lg"
        borderBottomLeftRadius={[0, 0, 'lg']}
        borderBottomRightRadius={[0, 0, 'lg']}
        position="relative"
        mt={['auto', 'auto', 'unset']}
        maxHeight={['calc(100vh - 24px)', 'calc(100vh - 96px)']}
      >
        <Box
          css={{
            overflowY: 'scroll',

            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <DrawerHeader
            enableGoBack={enableGoBack}
            icon={icon}
            isWaitingOnPerformedAction={isWaitingOnPerformedAction}
            onClose={onClose}
            onGoBack={onGoBack}
            title={title}
            waitingOnPerformedActionMessage={waitingOnPerformedActionMessage}
          />
          <Flex maxHeight="100%" flexGrow={1} flexDirection="column">
            <Suspense fallback={<></>}>{children}</Suspense>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
});
