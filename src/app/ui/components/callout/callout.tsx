import type { ReactNode } from 'react';

import { type RecipeVariantProps, cva } from 'leather-styles/css';
import { Box, type BoxProps, Stack, styled } from 'leather-styles/jsx';

import { Flag } from '../flag/flag';
import { getIconVariant } from './callout.utils';

const calloutRecipe = cva({
  base: {
    color: 'ink.text-primary',
    textAlign: 'left',
    width: '100%',
  },
  variants: {
    variant: {
      default: {
        bg: 'ink.text-non-interactive',
      },
      error: {
        bg: 'red.background-secondary',
      },
      info: {
        bg: 'blue.background-secondary',
      },
      success: {
        bg: 'green.background-secondary',
      },
      warning: {
        bg: 'yellow.background-secondary',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type CalloutVariants = RecipeVariantProps<typeof calloutRecipe>;

interface CalloutProps extends BoxProps {
  icon?: ReactNode;
  title?: string;
}
export function Callout(props: CalloutProps & CalloutVariants) {
  const { children, icon, title, variant = 'default', ...rest } = props;
  return (
    <Box className={calloutRecipe({ variant })} data-variant={variant} {...rest}>
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
            <styled.span lineHeight="24px" textStyle="label.02">
              {title}
            </styled.span>
          )}
          {children && <styled.span textStyle="caption.01">{children}</styled.span>}
        </Stack>
      </Flag>
    </Box>
  );
}
