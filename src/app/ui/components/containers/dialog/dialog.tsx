import { ReactNode, memo } from 'react';

import * as RadixDialog from '@radix-ui/react-dialog';
import { css } from 'leather-styles/css';

import { Header } from '@app/ui/components/containers/headers/header';
import { CardContent } from '@app/ui/layout/card/card-content';

export interface DialogProps {
  children?: ReactNode;
  footer?: ReactNode;
  isShowing: boolean;
  // figure out if isWaitingOnPerformedAction this just controls onClose
  // it stops click on headerActionButton, maybe thats enough?
  isWaitingOnPerformedAction?: boolean;
  onGoBack?(): void;
  onClose(): void;
  canClose?: boolean;
  title?: ReactNode;
}

export const Dialog = memo(
  ({
    children,
    footer,
    isWaitingOnPerformedAction,
    onClose,
    title,
    isShowing,
    canClose = true,
  }: DialogProps) => {
    if (!isShowing) return null;

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
              {canClose && (
                <Header
                  variant="page"
                  isWaitingOnPerformedAction={isWaitingOnPerformedAction}
                  onClose={canClose ? onClose : undefined}
                  title={title}
                />
              )}

              <CardContent>{children}</CardContent>
              {footer}
            </RadixDialog.Content>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }
);
