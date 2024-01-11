import { semanticTokens as leatherSemanticTokens } from '@leather-wallet/tokens';
import { defineSemanticTokens } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const semanticTokens = defineSemanticTokens({
  ...leatherSemanticTokens,
  // TODO: Move to mono repo
  focus: {
    value: { base: '{colors.lightModeBlue.500}', _dark: '{colors.darkModeBlue.500}' },
  },
});
