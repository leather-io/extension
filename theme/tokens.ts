import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  animations: {
    spin: {
      value: 'spin 1s linear infinite',
    },
  },
  sizes: {
    centeredPageFullWidth: { value: '500px' },
    desktopViewportMinWidth: { value: '480px' },
    xs: { value: '12px' },
    sm: { value: '16px' },
    md: { value: '24px' },
    lg: { value: '30px' },
    xl: { value: '36px' },
  },
  radii: {
    xs: { value: '8px' },
    sm: { value: '10px' },
    md: { value: '12px' },
    lg: { value: '16px' },
    xl: { value: '20px' },
    xxl: { value: '24px' },
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
  },
  colors,
  borders: {
    action: { value: '1px solid {colors.accent.action-primary-default}' },
    active: { value: '2px solid {colors.accent.border-default}' },
    background: { value: '2px solid {colors.accent.background-primary}' },
    dashed: { value: '2px dashed {colors.accent.component-background-default}' },
    default: { value: '1px solid {colors.accent.border-default}' },
    error: { value: '1px solid {colors.error.label}' },
    focus: { value: '2px solid {colors.accent.action-primary-default}' },
    invert: { value: '1px solid {colors.invert}' },
    subdued: { value: '1px solid {colors.accent.text-subdued}' },
    warning: { value: '1px solid {colors.warning.label}' },
  },
  transition: { value: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)' },
});
