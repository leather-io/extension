import type { ReactNode } from 'react';

import { type RecipeVariantProps, cva } from 'leather-styles/css';
import { HStack, type HTMLStyledProps, styled } from 'leather-styles/jsx';

const tagRecipe = cva({
  base: {
    borderRadius: 'xs',
    fontWeight: 500,
    maxWidth: 'fit-content',
    maxHeight: 'fit-content',
    p: 'space.01',
    textStyle: 'label.03',
  },
  variants: {
    variant: {
      default: {
        bg: 'ink.background-secondary',
        border: '1px solid {colors.ink.border-transparent}',
        color: 'ink.text-subdued',
      },
      error: {
        bg: 'red.background-primary',
        border: '1px solid {colors.red.border}',
        color: 'red.action-primary-default',
      },
      info: {
        bg: 'blue.background-primary',
        border: '1px solid {colors.blue.border}',
        color: 'blue.action-primary-default',
      },
      success: {
        bg: 'green.background-primary',
        border: '1px solid {colors.green.border}',
        color: 'green.action-primary-default',
      },
      warning: {
        bg: 'yellow.background-primary',
        border: '1px solid {colors.yellow.border}',
        color: 'yellow.action-primary-default',
      },
    },

    transparent: { true: { bg: 'transparent' } },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type TagVariants = RecipeVariantProps<typeof tagRecipe>;

export interface TagProps extends HTMLStyledProps<'div'> {
  icon?: ReactNode;
  label: string;
}
export function Tag({ icon, label, transparent, variant, ...props }: TagProps & TagVariants) {
  return (
    <styled.div className={tagRecipe({ transparent, variant })} {...props}>
      <HStack gap="space.01">
        {icon && icon}
        {label}
      </HStack>
    </styled.div>
  );
}
