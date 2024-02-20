import { defineTokens } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const colors = defineTokens.colors({
  // TODO: Move to mono repo
  current: { value: 'currentColor' },
  overlay: { value: 'rgba(0,0,0,0.4)' },
});
