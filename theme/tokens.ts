import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  sizes: {
    centeredPageFullWidth: { value: '500px' },
    desktopViewportMinWidth: { value: '480px' },
  },
  radii: {
    sm: { value: '10px' },
    md: { value: '12px' },
    lg: { value: '16px' },
  },
  spacing: {
    // Numbers are padded with 0 to ensure they are sorted correctly in TS
    // autocomplete. When typing, mt="04" + enter key, will jump straight to the
    // spacing value you need.
    'space.00': { value: '0' },
    'space.01': { value: '4px', description: '4px' },
    'space.02': { value: '8px', description: '8px' },
    'space.03': { value: '12px', description: '12px' },
    'space.04': { value: '16px', description: '16px' },
    'space.05': { value: '24px', description: '24px' },
    'space.06': { value: '32px', description: '32px' },
    'space.07': { value: '40px', description: '40px' },
    'space.08': { value: '48px', description: '48px' },
    'space.09': { value: '64px', description: '64px' },
    'space.10': { value: '72px', description: '72px' },
    'space.11': { value: '128px', description: '128px' },

    // Legacy spacing units
    'extra-tight': { value: '4px' },
    tight: { value: '8px' },
    'base-tight': { value: '12px' },
    base: { value: '16px' },
    'base-loose': { value: '20px' },
    loose: { value: '24px' },
    'extra-loose': { value: '32px' },
  },
  colors,
  borders: {
    default: { value: '1px solid {colors.accent.border-default}' },
    error: { value: '1px solid {colors.error}' },
    'action-primary-default': { value: '1px solid {colors.accent.action-primary-default}' },
  },
});
