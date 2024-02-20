import { defineRecipe } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const linkRecipe = defineRecipe({
  description: 'The styles for the Link component',
  className: 'link',
  jsx: ['Link'],
  base: {
    appearance: 'none',
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
          background: 'ink.non-interactive',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
        },
        _active: {
          _before: {
            background: 'ink.text-primary',
          },
          color: 'ink.text-primary',
        },
        _focus: {
          _before: { background: 'focus' },
          color: 'ink.text-primary',
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'ink.action-primary-hover',
          },
        },
        color: 'ink.text-primary',
      },

      text: {
        _before: {
          content: '""',
          background: 'ink.action-primary-hover',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
          visibility: 'hidden',
        },
        _active: {
          _before: {
            background: 'ink.text-primary',
          },
          color: 'ink.text-primary',
          visibility: 'visible',
        },
        _focus: {
          _before: {
            background: 'focus',
            visibility: 'visible',
          },
          color: 'ink.text-primary',
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'ink.action-primary-hover',
            visibility: 'visible',
          },
        },
        color: 'ink.text-primary',
      },
    },

    // TODO: Remove invert code
    invert: { true: {} },
    disabled: { true: {} },
    fullWidth: { true: { width: '100%' } },
  },

  defaultVariants: {
    size: 'md',
    variant: 'underlined',
  },

  // TODO: Remove invert code
  compoundVariants: [
    {
      css: {
        _focus: {
          _before: {
            background: 'ink.background-primary',
            visibility: 'visible',
          },
          outline: 0,
        },
        _hover: {
          _before: {
            background: 'ink.background-primary',
            visibility: 'visible',
          },
        },
        color: 'ink.background-secondary',
      },
      invert: true,
      variant: 'underlined',
    },
    {
      css: {
        _before: {
          content: '""',
          background: 'ink.non-interactive',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
        },
        color: 'ink.non-interactive',
        cursor: 'not-allowed',
      },
      disabled: true,
      variant: 'underlined',
    },
    {
      css: {
        _before: {
          content: '""',
          background: 'ink.non-interactive',
          bottom: '-2px',
          height: '2px',
          left: 0,
          position: 'absolute',
          right: 0,
          visibility: 'visible',
        },
        color: 'ink.non-interactive',
        cursor: 'not-allowed',
      },
      disabled: true,
      variant: 'text',
    },
  ],
});
