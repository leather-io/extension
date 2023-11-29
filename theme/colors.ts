import { colors as leatherColors } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const colors = defineTokens.colors({
  current: { value: 'currentColor' },
  ...leatherColors,
});
