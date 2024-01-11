import { defineRecipe } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const linkRecipe = defineRecipe({
  description: 'The styles for the Link component',
  className: 'link',
  jsx: ['Link'],
  base: {
    _disabled: {
      cursor: 'not-allowed',
    },
    appearance: 'none',
    color: 'accent.text-primary',
    display: 'inline',
    mb: 'space.01',
    p: 'unset',
    pos: 'relative',
    position: 'relative',
    pt: 'space.01',
    textAlign: 'left',
  },
  variants: {
    size: {
      sm: {
        textStyle: 'label.03',
      },
      md: {
        textStyle: 'label.02',
      },
      lg: {
        textStyle: 'label.01',
      },
    },
    variant: {
      underlined: {
        _before: {
          content: '""',
          background: 'accent.non-interactive',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
        },
        _active: {
          _before: {
            background: 'accent.text-primary',
          },
          color: 'accent.text-primary',
        },
        _disabled: {
          _before: {
            background: 'accent.non-interactive',
          },
          color: 'accent.non-interactive',
        },
        _focus: {
          _before: { background: 'focus' },
          color: 'accent.text-primary',
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'accent.action-primary-hover',
          },
        },
      },

      text: {
        _before: {
          content: '""',
          background: 'accent.action-primary-hover',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
          visibility: 'hidden',
        },
        _active: {
          _before: {
            background: 'accent.text-primary',
          },
          color: 'accent.text-primary',
          visibility: 'visible',
        },
        _disabled: {
          _before: {
            background: 'accent.non-interactive',
            visibility: 'visible',
          },
          color: 'accent.non-interactive',
        },
        _focus: {
          _before: {
            background: 'focus',
            visibility: 'visible',
          },
          color: 'accent.text-primary',
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'accent.action-primary-hover',
            visibility: 'visible',
          },
        },
      },
    },

    // TODO: Remove invert code
    invert: { true: {} },

    fullWidth: { true: { width: '100%' } },
  },

  defaultVariants: {
    size: 'md',
    variant: 'underlined',
  },

  // TODO: Remove invert code
  compoundVariants: [
    {
      variant: 'underlined',
      invert: true,
      css: {
        _focus: {
          _before: {
            background: 'accent.background-primary',
            visibility: 'visible',
          },
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'accent.background-primary',
            visibility: 'visible',
          },
        },
        color: 'accent.background-secondary',
      },
    },
  ],
});
