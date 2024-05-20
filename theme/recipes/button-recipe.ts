import { defineRecipe } from '@pandacss/dev';
import { ColorToken } from 'leather-styles/tokens';

function loadingStyles(color: ColorToken) {
  return {
    _loading: {
      _after: {
        animation: 'spin',
        border: '2px solid',
        borderColor: color,
        borderBottomColor: 'transparent',
        boxSizing: 'border-box',
        content: '""',
        display: 'inline-block',
        height: '20px',
        left: 'calc(50% - 10px)',
        position: 'absolute',
        rounded: '50%',
        top: 'calc(50% - 10px)',
        width: '20px',
      },
      color: 'transparent !important',
    },
  };
}

// ts-unused-exports:disable-next-line
export const buttonRecipe = defineRecipe({
  description: 'The styles for the Button component',
  className: 'button',
  jsx: ['Button'],
  base: {
    position: 'relative',
    rounded: 'xs',
    textStyle: 'label.02',
  },
  variants: {
    size: {
      sm: {
        px: 'space.02',
        py: 'space.01',
      },
      md: {
        px: 'space.04',
        py: 'space.03',
      },
    },
    variant: {
      solid: {
        _active: {
          bg: 'ink.action-primary-default',
        },
        _disabled: {
          _hover: { bg: 'ink.background-secondary' },
          bg: 'ink.background-secondary',
          color: 'ink.text-non-interactive',
          cursor: 'not-allowed',
        },
        _focus: {
          _before: {
            border: '3px solid {colors.blue.border}',
          },
        },
        _hover: {
          bg: 'ink.action-primary-hover',
        },
        bg: 'ink.action-primary-default',
        color: 'ink.background-primary',
        ...loadingStyles('ink.background-primary'),
      },

      outline: {
        _active: {
          bg: 'ink.component-background-pressed',
        },
        _disabled: {
          _hover: { bg: 'unset' },
          border: '1px solid {colors.ink.text-non-interactive}',
          color: 'ink.text-non-interactive',
          cursor: 'not-allowed',
        },
        _focus: {
          _before: {
            border: '3px solid {colors.blue.border}',
          },
        },
        _hover: {
          bg: 'ink.component-background-hover',
        },
        border: '1px solid {colors.ink.action-primary-default}',
        ...loadingStyles('ink.action-primary-default'),
      },

      ghost: {
        _active: {
          bg: 'ink.component-background-pressed',
        },
        _disabled: {
          _hover: { bg: 'unset' },
          color: 'ink.text-non-interactive',
          cursor: 'not-allowed',
        },
        _focus: {
          _before: {
            border: '3px solid {colors.blue.border}',
          },
        },
        _hover: {
          bg: 'ink.component-background-hover',
        },
        ...loadingStyles('ink.action-primary-default'),
      },
    },

    invert: { true: {} },

    fullWidth: { true: { width: '100%' } },
    trigger: { true: {} },
  },

  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },

  compoundVariants: [
    {
      css: {
        _active: {
          bg: 'ink.component-background-pressed',
        },
        _hover: {
          bg: 'ink.background-primary',
        },
        _loading: {
          _after: {
            borderColor: 'ink.text-primary',
          },
        },
        bg: 'ink.background-secondary',
        color: 'ink.text-primary',
      },
      invert: true,
      variant: 'solid',
    },
    {
      css: {
        _active: {
          bg: 'ink.text-primary',
        },
        _before: {
          borderColor: 'ink.background-secondary',
        },
        _hover: {
          bg: 'ink.action-primary-hover',
        },
        _loading: {
          _after: {
            borderColor: 'ink.text-primary',
          },
        },
        border: '1px solid {colors.ink.background-secondary}',
        color: 'ink.background-secondary',
      },
      invert: true,
      variant: 'outline',
    },
    {
      css: {
        p: 'space.02',
      },
      trigger: true,
      variant: 'ghost',
    },
  ],
});
