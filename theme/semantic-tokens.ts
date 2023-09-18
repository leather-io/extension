import { defineSemanticTokens } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const semanticTokens = defineSemanticTokens({
  colors: {
    // Primative colours defined as semantic tokens to match Radix
    brown: {
      1: { value: { base: '{colors.lightModeBrown.1}', _dark: '{colors.darkModeBrown.1}' } },
      2: { value: { base: '{colors.lightModeBrown.2}', _dark: '{colors.darkModeBrown.2}' } },
      3: { value: { base: '{colors.lightModeBrown.3}', _dark: '{colors.darkModeBrown.3}' } },
      4: { value: { base: '{colors.lightModeBrown.4}', _dark: '{colors.darkModeBrown.4}' } },
      5: { value: { base: '{colors.lightModeBrown.5}', _dark: '{colors.darkModeBrown.5}' } },
      6: { value: { base: '{colors.lightModeBrown.6}', _dark: '{colors.darkModeBrown.6}' } },
      7: { value: { base: '{colors.lightModeBrown.7}', _dark: '{colors.darkModeBrown.7}' } },
      8: { value: { base: '{colors.lightModeBrown.8}', _dark: '{colors.darkModeBrown.8}' } },
      9: { value: { base: '{colors.lightModeBrown.9}', _dark: '{colors.darkModeBrown.9}' } },
      10: { value: { base: '{colors.lightModeBrown.10}', _dark: '{colors.darkModeBrown.10}' } },
      11: { value: { base: '{colors.lightModeBrown.11}', _dark: '{colors.darkModeBrown.11}' } },
      12: { value: { base: '{colors.lightModeBrown.12}', _dark: '{colors.darkModeBrown.12}' } },
    },
    ink: {
      1: { value: { base: '{colors.lightModeInk.1}', _dark: '{colors.darkModeInk.1}' } },
      2: { value: { base: '{colors.lightModeInk.2}', _dark: '{colors.darkModeInk.2}' } },
      3: { value: { base: '{colors.lightModeInk.3}', _dark: '{colors.darkModeInk.3}' } },
      4: { value: { base: '{colors.lightModeInk.4}', _dark: '{colors.darkModeInk.4}' } },
      5: { value: { base: '{colors.lightModeInk.5}', _dark: '{colors.darkModeInk.5}' } },
      6: { value: { base: '{colors.lightModeInk.6}', _dark: '{colors.darkModeInk.6}' } },
      7: { value: { base: '{colors.lightModeInk.7}', _dark: '{colors.darkModeInk.7}' } },
      8: { value: { base: '{colors.lightModeInk.8}', _dark: '{colors.darkModeInk.8}' } },
      9: { value: { base: '{colors.lightModeInk.9}', _dark: '{colors.darkModeInk.9}' } },
      10: { value: { base: '{colors.lightModeInk.10}', _dark: '{colors.darkModeInk.10}' } },
      11: { value: { base: '{colors.lightModeInk.11}', _dark: '{colors.darkModeInk.11}' } },
      12: { value: { base: '{colors.lightModeInk.12}', _dark: '{colors.darkModeInk.12}' } },
    },
    accent: {
      'text-primary': {
        value: { base: '{colors.lightModeBrown.12}', _dark: '{colors.darkModeBrown.12}' },
      },
      'text-subdued': {
        value: { base: '{colors.lightModeBrown.8}', _dark: '{colors.darkModeBrown.8}' },
      },
      'action-primary-hover': {
        value: { base: '{colors.lightModeBrown.10}', _dark: '{colors.darkModeBrown.10}' },
      },
      'action-primary-default': {
        value: { base: '{colors.lightModeBrown.9}', _dark: '{colors.darkModeBrown.9}' },
      },
      'border-hover': {
        value: { base: '{colors.lightModeBrown.5}', _dark: '{colors.darkModeBrown.8}' },
      },
      'border-default': {
        value: { base: '{colors.lightModeBrown.4}', _dark: '{colors.darkModeBrown.7}' },
      },
      'non-interactive': {
        value: { base: '{colors.lightModeBrown.7}', _dark: '{colors.darkModeBrown.6}' },
      },
      'component-background-pressed': {
        value: { base: '{colors.lightModeBrown.4}', _dark: '{colors.darkModeBrown.5}' },
      },
      'component-background-hover': {
        value: { base: '{colors.lightModeBrown.2}', _dark: '{colors.darkModeBrown.4}' },
      },
      'component-background-default': {
        value: { base: '{colors.lightModeBrown.3}', _dark: '{colors.darkModeBrown.3}' },
      },
      'background-secondary': {
        value: { base: '{colors.lightModeBrown.2}', _dark: '{colors.darkModeBrown.2}' },
      },
      'background-primary': {
        value: { base: '{colors.lightModeBrown.1}', _dark: '{colors.darkModeBrown.1}' },
      },
      disabled: {
        value: { base: '{colors.blue.100}', _dark: '{colors.blue.100}' },
      },
      focused: {
        value: { base: '{colors.blue.500}', _dark: '{colors.blue.500}' },
      },
      warning: {
        value: { base: '{colors.yellow.100}', _dark: '{colors.yellow.100}' },
      },
      'notification-text': {
        value: { base: '{colors.lightModeBrown.12}', _dark: '{colors.darkModeBrown.12}' },
      },
    },
    error: {
      value: { base: '{colors.red.600}', _dark: '{colors.red.600}' },
    },
  },
});
