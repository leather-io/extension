import { defineRecipe } from '@pandacss/dev';
import { ColorToken } from 'leather-styles/tokens';

const basePesudoOutlineProps = {
  content: '""',
  position: 'absolute',
  rounded: 'xs',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const focusStyles = {
  _focus: {
    _before: {
      ...basePesudoOutlineProps,
      border: '2px solid',
      borderColor: 'blue.500',
    },
    _focusWithin: { outline: 'none' },
  },
};

function loadingStyles(color: ColorToken) {
  return {
    _loading: {
      color: 'transparent !important',
      _after: {
        content: '""',
        position: 'absolute',
        width: '20px',
        height: '20px',
        left: 'calc(50% - 10px)',
        rounded: '50%',
        display: 'inline-block',
        borderTop: '2px solid',
        borderColor: color,
        borderRight: '2px solid transparent',
        boxSizing: 'border-box',
        animation: 'rotate 1s linear infinite',
      },
    },
  };
}

// ts-unused-exports:disable-next-line
export const buttonRecipe = defineRecipe({
  description: 'The styles for the Button component',
  className: 'button',
  jsx: ['LeatherButton'],
  base: {
    position: 'relative',
    py: 'space.03',
    px: 'space.04',
    rounded: 'xs',
    textStyle: 'label.01',
    _disabled: { cursor: 'not-allowed' },
  },
  variants: {
    size: {
      sm: {
        textStyle: 'label.02',
        py: 'space.02',
        px: 'space.03',
      },
    },
    variant: {
      // Solid button
      solid: {
        bg: 'ink.12',
        color: 'ink.1',
        _hover: { bg: 'ink.10' },
        _active: { bg: 'ink.12' },
        _disabled: {
          _hover: {
            bg: 'ink.6',
          },
          bg: 'ink.6',
          color: 'white',
        },
        ...focusStyles,
        ...loadingStyles('ink.2'),
      },

      // Outline button
      outline: {
        _hover: { bg: 'ink.3' },
        _focus: {
          _before: { border: '2px solid', borderColor: 'blue.500' },
        },
        _before: {
          ...basePesudoOutlineProps,
          border: '1px solid',
          borderColor: 'ink.12',
        },
        ...loadingStyles('ink.12'),
      },

      // Ghost button
      ghost: {
        _hover: { bg: 'accent.component-background-hover' },
        _focus: { _before: { border: '2px solid', borderColor: 'blue.500' } },
        ...loadingStyles('ink.12'),
      },

      // Link button
      link: {
        appearance: 'none',
        pos: 'relative',
        color: 'ink.12',
        display: 'inline',
        p: 'unset',
        textAlign: 'left',
        _hover: { color: 'ink.8' },
        _active: { color: 'ink.8' },
        _focus: {
          outline: 0,
          _before: { color: 'blue.500' },
        },
        _before: {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-2px',
          height: '2px',
          background: 'currentColor',
        },
        _disabled: {
          color: 'ink.6',
          _hover: { color: 'ink.6' },
        },
      },

      // Text as action button
      text: {
        appearance: 'none',
        pos: 'relative',
        color: 'ink.12',
        display: 'inline',
        p: 'unset',
        textAlign: 'left',
        _hover: { color: 'ink.8' },
        _active: { color: 'ink.8' },
        _disabled: {
          color: 'ink.6',
          _hover: { color: 'ink.6' },
        },
      },
    },

    // Invert variant
    // - Flag that allows using dark mode in light mode (and vice versa), used
    //   in some UIs
    invert: { true: {} },

    // Full width variant helper
    fullWidth: { true: { width: '100%' } },
  },

  defaultVariants: {
    variant: 'solid',
  },

  compoundVariants: [
    {
      variant: 'solid',
      invert: true,
      css: {
        bg: 'ink.2',
        color: 'ink.12',
        _hover: { bg: 'ink.1' },
        _active: { bg: 'ink.4' },
        _loading: { _after: { borderColor: 'ink.12' } },
      },
    },
    {
      variant: 'outline',
      invert: true,
      css: {
        color: 'ink.2',
        _before: { borderColor: 'ink.2' },
        _hover: { bg: 'ink.10' },
        _active: { bg: 'ink.12' },
        _loading: { _after: { borderColor: 'ink.12' } },
      },
    },
    {
      variant: 'link',
      invert: true,
      css: {
        color: 'ink.2',
        _hover: { color: 'ink.5' },
      },
    },
  ],
});
