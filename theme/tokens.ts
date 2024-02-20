import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  ...leatherTokens,
  // TODO: Update in mono repo
  borders: {
    action: { value: '1px solid {colors.ink.action-primary-default}' },
    active: { value: '2px solid {colors.ink.border-default}' },
    background: { value: '2px solid {colors.ink.background-primary}' },
    dashed: { value: '2px dashed {colors.ink.component-background-default}' },
    default: { value: '1px solid {colors.ink.border-default}' },
    error: { value: '1px solid {colors.red.border}' },
    focus: { value: '2px solid {colors.ink.action-primary-default}' },
    invert: { value: '1px solid {colors.invert}' },
    subdued: { value: '1px solid {colors.ink.text-subdued}' },
    warning: { value: '1px solid {colors.yellow.border}' },
  },
  colors,
});
