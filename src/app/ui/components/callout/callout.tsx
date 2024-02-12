import type { ReactNode } from 'react';

import { css } from 'leather-styles/css';
import { Box, type BoxProps, Stack, styled } from 'leather-styles/jsx';

import { Flag } from '../flag/flag';
import { getIconVariant } from './callout.utils';

type CalloutVariant = 'default' | 'error' | 'info' | 'success' | 'warning';

const calloutStyles = css({
  color: 'ink.text-primary',
  textAlign: 'left',
  width: '100%',

  '&[data-variant="default"]': {
    backgroundColor: 'ink.non-interactive',
  },
  '&[data-variant="error"]': {
    backgroundColor: 'red.background-secondary',
  },
  '&[data-variant="info"]': {
    backgroundColor: 'blue.background-secondary',
  },
  '&[data-variant="success"]': {
    backgroundColor: 'green.background-secondary',
  },
  '&[data-variant="warning"]': {
    backgroundColor: 'yellow.background-secondary',
  },
});

interface CalloutProps extends BoxProps {
  icon?: ReactNode;
  title?: string;
  variant?: CalloutVariant;
}
export function Callout(props: CalloutProps) {
  const { children, icon, title, variant = 'default', ...rest } = props;
  return (
    <Box className={calloutStyles} data-variant={variant} {...rest}>
      <Flag
        align="top"
        img={icon ? icon : getIconVariant(variant)}
        p="space.05"
        reverse
        spacing="space.03"
        width="100%"
      >
        <Stack>
          {title && (
            <styled.span fontWeight={500} lineHeight="24px" textStyle="label.02">
              {title}
            </styled.span>
          )}
          {children && <styled.span textStyle="caption.02">{children}</styled.span>}
        </Stack>
      </Flag>
    </Box>
  );
}
