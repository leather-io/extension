// See
// https://www.figma.com/file/Li7qK8ZIG9c5dKSNOPO4iCtv/%E2%9D%96-Design-System?node-id=1909-4136&t=GGTMJo3PyBf2gns5-0
// for a detailed description of the palette and the theme.

const palette = {
  white: '#ffffff',
  black: '#ococod',

  blue050: '#f7f8fd',
  blue100: '#eef2fb',
  blue200: '#e5ebfa',
  blue300: '#cedafa',
  blue400: '#7f97f1',
  blue500: '#5c6cf2',
  blue600: '#5546ff',
  blue700: '#2323c7',
  blue800: '#ofofa9',
  blue900: '#oboa63',

  green100: '#f2f9f1',
  green300: '#d9edd4',
  green500: '#23a978',
  green600: '#008051',

  gray050: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#efefef',
  gray300: '#dddddd',
  gray400: '#9a9a9a',
  gray500: '#777777',
  gray600: '#666666',
  gray700: '#333333',
  gray800: '#262626',
  gray900: '#171717',

  orange100: '#fff5eb',
  orange300: '#ffeoc2',
  orange500: '#ffbd7a',
  orange600: '#f59300',

  red100: '#fceeed',
  red300: '#f7cdca',
  red500: '#e76c6a',
  red600: '#c83532',

  slate050: '#f9f9fa',
  slate100: '#f5f5f7',
  slate200: '#efeff2',
  slate300: '#dcdde2',
  slate400: '#989ca3',
  slate500: '#74777D',
  slate600: '#62676e',
  slate700: '#303236',
  slate800: '#242629',
  slate900: '#151619',
};

export const figmaTheme = {
  // Background

  background: palette.white,
  backgroundSubdued: palette.slate100,

  // Surface

  surface: palette.white,
  surfaceHovered: palette.slate050,
  surfacePressed: palette.slate200,
  surfacedisabled: palette.slate100,
  surfaceSelected: palette.blue050,
  surfaceSubdued: palette.slate100,
  surfaceContrast: palette.black,
  overlay: `${palette.black}80`,

  // Border

  border: palette.slate300,
  borderSubdued: palette.slate200,
  borderDisabled: palette.slate200,
  borderFocused: palette.blue300,

  // Icon

  icon: palette.slate800,
  iconSubdued: palette.slate500,
  iconDisabled: palette.slate400,
  iconOnPrimary: palette.white,
  iconOnCritical: palette.white,
  iconOnWarning: palette.white,
  iconOnSuccess: palette.white,

  // Text

  text: palette.slate800,
  textSubdued: palette.slate500,
  textFaint: palette.slate400,
  textDisabled: palette.slate400,
  textOnPrimary: palette.white,
  textOnCritical: palette.white,
  textOnWarning: palette.white,
  textOnSuccess: palette.white,
  textOnContrast: palette.white,

  // Primary

  actionPrimary: palette.blue600,
  actionPrimaryHovered: palette.blue500,
  actionPrimaryPressed: palette.blue700,
  actionPrimaryDisabled: palette.blue400,
  actionSubdued: palette.blue100,
  actionSubduedHovered: palette.blue200,
  actionSubduedPressed: palette.blue300,
  actionSubduedDisabled: palette.gray100,
  iconOnPrimarySubdued: palette.blue600,
  textOnPrimarySubdued: palette.blue600,

  // Secondary

  secondary: palette.white,
  secondarySubdued: palette.slate100,
  surfaceSecondary: palette.slate200,
  actionSecondary: palette.white,
  actionSecondaryHovered: palette.slate050,
  actionSecondaryDisabled: palette.slate050,

  // Interactive

  interactive: palette.blue600,
  interactiveHovered: palette.blue500,
  interactivePressed: palette.blue700,
  interactiveDisabled: palette.slate300,

  // Success

  textSuccess: palette.green600,
  iconSuccess: palette.green600,
  borderSuccess: palette.green300,
  surfaceSuccess: palette.green300,

  // Warning

  iconWarning: palette.orange600,
  actionWarning: palette.orange600,
  borderWarning: palette.orange300,
  surfaceWarning: palette.orange300,

  // Critical

  textCritical: palette.red600,
  iconCritical: palette.red600,
  actionCritical: palette.red600,
  borderCritical: palette.red300,
  surfaceCritical: palette.red300,

  // Accent

  accent: palette.blue600,
  iconAccent: palette.blue600,
  surfaceAccent: palette.blue050,
  borderAccent: palette.blue600,
} as const;
