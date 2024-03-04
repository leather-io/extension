import { tokens as leatherTokens } from '@leather-wallet/tokens';
import { defineTokens } from '@pandacss/dev';

import { colors } from './colors';

const tempTokens = {
  sizes: {
    // 4370 TODO - update in monorepo and deprecate - centeredPageFullWidth
    pageWidth: { value: '500px' },
    twoColumnPageWidth: { value: '500px' },
    fullPageMaxWidth: { value: '882px' },
    // FIXME - audit dialogHeight
    dialogHeight: { value: '600px' },
    dialogContentHeight: { value: '500px' },
    headerHeight: { value: '80px' },
    footerHeight: { value: '95px' },
    // #4250 setting consistent dimensions of extension + popup to match mobile
    popupWidth: { value: '390px' },
    popupHeight: { value: '756px' },
    popupHeaderHeight: { value: '68px' },
    headerContainerHeight: { value: '40px' },
    logoHeight: { value: '32px' },
    logoWidth: { value: '86px' },
    inputHeight: { value: '64px' },
    iconButtonWithLabelWidth: { value: '64px' },
    settingsMenuWidth: { value: '240px' },
  },
};

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

  sizes: {
    ...leatherTokens.sizes,
    ...tempTokens.sizes,
  },
});
