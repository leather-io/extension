import { forwardRef } from 'react';

import * as RadixToast from '@radix-ui/react-toast';
import { css } from 'leather-styles/css';

export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastProps {
  message: string;
  variant: ToastVariant;
}

const toastRootStyles = css({
  bg: 'ink.text-primary',
  color: 'ink.background-primary',
  boxShadow:
    '0px 12px 24px 0px rgba(18, 16, 15, 0.08), 0px 4px 8px 0px rgba(18, 16, 15, 0.08), 0px 0px 2px 0px rgba(18, 16, 15, 0.08)',
  maxWidth: { base: '452px', smOnly: '342px' },
  pl: 'space.03',
  pr: 'space.04',
  py: 'space.03',
  rounded: 'xs',

  '&[data-state=open]': {
    animation: 'toastAppear 160ms cubic-bezier(0, 0.45, 0.6, 1) forwards',
  },
  '&[data-state=closed]': {
    animation: 'fadeout',
  },
});
const Root: typeof RadixToast.Root = forwardRef((props, ref) => (
  <RadixToast.Root className={toastRootStyles} ref={ref} {...props} />
));

const toastViewportStyles = css({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 'space.02',
  height: 'fit-content',
  m: '0 auto',
  outline: 'none',
  p: 'space.05',
  position: 'fixed',
  top: 0,
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: '100%',
  zIndex: 9999,
  pointerEvents: 'none',
});
const Viewport: typeof RadixToast.Viewport = forwardRef((props, ref) => (
  <RadixToast.Viewport className={toastViewportStyles} ref={ref} {...props} />
));

export const Toast = {
  Provider: RadixToast.Provider,
  Title: RadixToast.Title,
  Root,
  Viewport,
};
