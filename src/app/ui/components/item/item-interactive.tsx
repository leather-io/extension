import { forwardRef } from 'react';

import { type RecipeVariantProps, css, cva } from 'leather-styles/css';
import { Box, BoxProps } from 'leather-styles/jsx';

import { isDefined } from '@shared/utils';

const basePseudoOutlineProps = {
  content: '""',
  rounded: 'xs',
  position: 'absolute',
  top: '-space.03',
  left: '-space.03',
  bottom: '-space.03',
  right: '-space.03',
  pointerEvents: 'none',
};

const focusVisibleStyles = {
  _before: {
    ...basePseudoOutlineProps,
    border: '2px solid',
    borderColor: 'lightModeBlue.500',
  },
  _focusWithin: { outline: 'none' },
};

export const itemBaseStyles = css.raw({
  position: 'relative',
  bg: 'ink.background-primary',
  color: 'ink.text-primary',
  cursor: 'default',
  display: 'flex',
  height: 'auto',
  outline: 'none',
  rounded: 'xs',
  userSelect: 'none',
  width: '100%',
});

export const itemInteractiveStyles = css.raw({
  cursor: 'pointer',
  position: 'relative',
  _before: basePseudoOutlineProps,

  '&:is(:active)': {
    _before: {
      bg: 'ink.component-background-pressed',
    },
  },
  '&:is(:focus-visible)': {
    ...focusVisibleStyles,
  },
  '&:is(:disabled, [data-disabled])': {
    _active: { bg: 'unset' },
    _focus: { border: 'unset' },
    _hover: { bg: 'unset' },
    color: 'ink.non-interactive',
    cursor: 'not-allowed',
  },

  '&:is(:hover, [data-highlighted])': {
    _before: {
      bg: 'ink.component-background-hover',
      borderColor: 'transparent',
    },
  },
});

const itemRecipe = cva({
  base: itemBaseStyles,
  variants: {
    disabled: { true: {} },
    interactive: {
      true: itemInteractiveStyles,
    },
  },
});

export const itemCaptionStyles = css({
  _groupDisabled: { color: 'ink.non-interactive' },
  color: 'ink.text-subdued',
});

export const itemChevronStyles = css({
  _groupDisabled: { color: 'ink.non-interactive' },
  color: 'ink.action-primary-default',
});

type ItemVariantProps = RecipeVariantProps<typeof itemRecipe>;

export const ItemInteractive = forwardRef<HTMLDivElement, BoxProps & ItemVariantProps>(
  (props, ref) => {
    const { disabled, onClick, ...rest } = props;
    const isInteractive = isDefined(onClick);
    return (
      <Box
        className={`group ${itemRecipe({ interactive: isInteractive })}`}
        data-disabled={disabled}
        onClick={isInteractive ? onClick : undefined}
        ref={ref}
        tabIndex={0}
        {...rest}
      />
    );
  }
);
