import { useRef, useCallback, memo, ReactNode, Suspense } from 'react';
import { Flex, useEventListener, IconButton, color, transition } from '@stacks/ui';
import { FiX as IconX } from 'react-icons/fi';

import { useOnClickOutside } from '@app/common/hooks/use-onclickoutside';
import { isString } from '@app/common/utils';
import { Title } from '@app/components/typography';

export interface BaseDrawerProps {
  isShowing: boolean;
  title?: string | JSX.Element;
  pauseOnClickOutside?: boolean;
  onClose: () => void;
  children?: ReactNode;
}

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

const DrawerHeader = ({
  title,
  onClose,
}: {
  title: BaseDrawerProps['title'];
  onClose: BaseDrawerProps['onClose'];
}) => {
  return (
    <Flex pb="base" justifyContent="space-between" alignItems="center" pt="loose" px="loose">
      {title && isString(title) ? (
        <Title fontSize="20px" lineHeight="28px">
          {title}
        </Title>
      ) : (
        title
      )}
      <IconButton
        transform="translateX(8px)"
        size="36px"
        iconSize="20px"
        onClick={onClose}
        color={color('text-caption')}
        _hover={{ color: color('text-title') }}
        icon={IconX}
      />
    </Flex>
  );
};

export const BaseDrawer = memo((props: BaseDrawerProps) => {
  const { title, isShowing, onClose, children, pauseOnClickOutside } = props;
  const ref = useDrawer(isShowing, onClose, pauseOnClickOutside);
  return (
    <Flex
      bg={`rgba(0,0,0,0.${isShowing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      top={0}
      left={0}
      height="100%"
      pt="loose"
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
    >
      <Flex
        flexDirection="column"
        flexGrow={0}
        ref={ref}
        opacity={isShowing ? 1 : 0}
        transform={isShowing ? 'none' : 'translateY(35px)'}
        transition={isShowing ? transition + ' 0.1s' : transition}
        transitionDuration="0.4s"
        willChange="transform, opacity"
        width="100%"
        maxWidth="472px"
        bg="white"
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
        borderBottomLeftRadius={[0, '24px', '24px', '24px']}
        borderBottomRightRadius={[0, '24px', '24px', '24px']}
        position="relative"
        mt={['auto', 'unset', 'unset', 'unset']}
        maxHeight={[
          'calc(100vh - 24px)',
          'calc(100vh - 96px)',
          'calc(100vh - 96px)',
          'calc(100vh - 96px)',
        ]}
      >
        <DrawerHeader title={title} onClose={onClose} />
        <Flex maxHeight="100%" flexGrow={1} overflowY="auto" flexDirection="column">
          <Suspense fallback={<></>}>{children}</Suspense>
        </Flex>
      </Flex>
    </Flex>
  );
});
