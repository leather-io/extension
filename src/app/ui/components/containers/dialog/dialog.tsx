import { JSXElementConstructor, ReactElement, ReactNode, cloneElement } from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
import { css } from 'leather-styles/css';
import { Box } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { pxStringToNumber } from '@shared/utils/px-string-to-number';

export interface DialogProps {
  isShowing: boolean;
  onClose(): void;
}
interface RadixDialogProps extends DialogProps {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactElement<any, string | JSXElementConstructor<any>>;
  onGoBack?(): void;
  contentMaxHeight?: string | number;
}

export function getHeightOffset(header: ReactNode, footer: ReactNode): number {
  const headerHeight = header ? pxStringToNumber(token('sizes.headerHeight')) : 0;
  const footerHeight = footer ? pxStringToNumber(token('sizes.footerHeight')) : 0;
  return headerHeight + footerHeight;
}

function getContentMaxHeight(maxHeightOffset: number) {
  return `calc(${80}vh - ${maxHeightOffset}px)`;
}

export function Dialog({
  children,
  footer,
  header,
  onClose,
  isShowing,
  contentMaxHeight,
}: RadixDialogProps) {
  if (!isShowing) return null;

  const maxHeightOffset = getHeightOffset(header, footer);

  return (
    <RadixDialog.Root open>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={css({
            bg: 'overlay',
            position: 'fixed',
            inset: 0,
            animation: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          })}
        >
          <RadixDialog.Content
            onPointerDownOutside={onClose}
            className={css({
              bg: 'ink.background-primary',
              // remove borderRadius on small to give impression of full page
              borderRadius: { base: '0', md: 'md' },
              boxShadow:
                'hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0 10px 20px -15px',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { base: '100vw', md: '90vw' },
              height: { base: '100%', md: 'auto' },
              maxWidth: { base: '100vw', md: 'pageWidth' },
              maxHeight: { base: '100vh', md: '90vh' },
              animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
            })}
          >
            {header && cloneElement(header, { onClose })}
            <Box
              height="100%"
              overflowY="auto"
              style={{
                maxHeight: contentMaxHeight
                  ? contentMaxHeight
                  : getContentMaxHeight(maxHeightOffset),
                marginBottom: footer ? token('sizes.footerHeight') : token('spacing.space.04'),
              }}
            >
              {children}
            </Box>
            {footer}
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
