import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';

// ts-unused-exports:disable-next-line
export const tokens = defineTokens({
  ...leatherTokens,

  colors,
});
