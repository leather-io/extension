import { defineRecipe } from '@pandacss/dev';
import { ColorToken } from 'leather-styles/tokens';

function loadingStyles(color: ColorToken) {
  return {
    _loading: {
      _after: {
        animation: 'spin',
        border: '2px solid',
        borderColor: color,
        borderTop: '2px solid',
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
    _disabled: {
      cursor: 'not-allowed',
    },
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
          bg: 'accent.action-primary-default',
        },
        _disabled: {
          bg: 'accent.background-secondary',
          color: 'accent.non-interactive',
        },
        _focus: {
          _before: {
            border: '3px solid {colors.focus}',
          },
        },
        _hover: {
          bg: 'accent.action-primary-hover',
        },
        bg: 'accent.action-primary-default',
        color: 'accent.background-primary',
        ...loadingStyles('accent.background-primary'),
      },

      outline: {
        _active: {
          bg: 'accent.component-background-pressed',
        },
        _focus: {
          _before: {
            border: '3px solid {colors.focus}',
          },
        },
        _hover: {
          bg: 'accent.component-background-hover',
        },
        border: '1px solid {colors.accent.action-primary-default}',
        ...loadingStyles('accent.action-primary-default'),
      },

      ghost: {
        _active: {
          bg: 'accent.component-background-pressed',
        },
        _focus: {
          _before: {
            border: '3px solid {focus}',
          },
        },
        _hover: {
          bg: 'accent.component-background-hover',
        },
        ...loadingStyles('accent.action-primary-default'),
      },
    },

    // TODO: Remove invert code
    invert: { true: {} },

    fullWidth: { true: { width: '100%' } },
    trigger: { true: {} },
  },

  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },

  // TODO: Remove invert code
  compoundVariants: [
    {
      css: {
        _active: {
          bg: 'accent.component-background-pressed',
        },
        _hover: {
          bg: 'accent.background-primary',
        },
        _loading: {
          _after: {
            borderColor: 'accent.text-primary',
          },
        },
        bg: 'accent.background-secondary',
        color: 'accent.text-primary',
      },
      invert: true,
      variant: 'solid',
    },
    {
      css: {
        _active: {
          bg: 'accent.text-primary',
        },
        _before: {
          borderColor: 'accent.background-secondary',
        },
        _hover: {
          bg: 'accent.action-primary-hover',
        },
        _loading: {
          _after: {
            borderColor: 'accent.text-primary',
          },
        },
        border: '1px solid {colors.accent.background-secondary}',
        color: 'accent.background-secondary',
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
