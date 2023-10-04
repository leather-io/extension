import React, {
  RefObject,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';

import { Box } from '@stacks/ui';
import { motion } from 'framer-motion';

interface AnimatedRouteProps {
  children: React.ReactNode;

  navbar?: boolean;
  navbarIcon?: 'arrow' | 'ex';
  title?: string;
  rightNavbarComponent?: React.ReactElement;
  accentColor?: boolean;
}

export const animatedRouteValues: any = {
  base: {
    initial: {
      opacity: 0,
      y: 0,
    },
    end: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -16,
    },
  },
  right: {
    initial: {
      opacity: 0,
      x: 16,
    },
    end: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -16,
    },
  },
  left: {
    initial: {
      opacity: 0,
      x: -16,
    },
    end: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: 16,
    },
  },
  up: {
    initial: {
      opacity: 0,
      y: 16,
    },
    end: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -16,
    },
  },
  upRight: {
    initial: {
      opacity: 0,
      x: 0,
      y: 16,
    },
    end: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      x: -16,
      y: 0,
    },
  },
  down: {
    initial: {
      opacity: 0,
      y: -16,
    },
    end: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: 16,
    },
  },
  deceleratedShort: {
    initial: {
      opacity: 0,
      scale: 1.1,
    },
    end: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
    },
  },
  emphasizedShort: {
    initial: {
      opacity: 0,
    },
    end: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },
};

const containerRefContext = createContext<RefObject<HTMLDivElement>>({
  current: null,
});
export const useContainerRef = () => useContext(containerRefContext);

export const AnimatedRoute = forwardRef((props: AnimatedRouteProps, ref) => {
  const {
    children,

    navbar,
    navbarIcon,
    title,

    rightNavbarComponent,
    accentColor = true,
  } = props;
  const { state } = useLocation();
  const animationDirection = 'right';
  const { initial, end, exit } = animatedRouteValues[animationDirection];
  const transition = {
    type: 'spring',
    stiffness: 1111,
    damping: 50,
    mass: 1,
  };

  const navigationType = useNavigationType();
  const isBack = (navigationType === 'POP' && state?.isBack !== false) || state?.isBack;

  const [urlSearchParams] = useSearchParams();
  const hideBackButton = urlSearchParams.get('hideBack') === 'true';

  const content = (
    <Box
      as={motion.div}
      display="flex"
      width="100%"
      flexDirection="column"
      height="full"
      initial={isBack ? exit : initial}
      style={{ overflow: 'auto' }}
      animate={end}
      exit={isBack ? initial : exit}
      transition={transition}
    >
      {children}
    </Box>
  );

  return content;
});

AnimatedRoute.displayName = 'AnimatedRoute';
