import { LiteralUnion } from 'type-fest';

type TextStylesLiteral =
  | 'display.large'
  | 'display.small'
  | 'body.large'
  | 'body.large.medium'
  | 'body.small'
  | 'body.small.medium'
  | 'caption'
  | 'caption.medium';

type NamedSpacingUnitsLiteral =
  | 'none'
  | 'extra-tight'
  | 'tight'
  | 'base-tight'
  | 'base'
  | 'base-loose'
  | 'loose'
  | 'extra-loose';

type ThemeColorsStringLiteral =
  | 'transparent'
  | 'current'
  | 'black'
  | 'white'
  | 'blue'
  | 'blue.100'
  | 'blue.200'
  | 'blue.300'
  | 'blue.400'
  | 'blue.900'
  | 'blue.hover'
  | 'ink'
  | 'ink.50'
  | 'ink.100'
  | 'ink.150'
  | 'ink.200'
  | 'ink.250'
  | 'ink.300'
  | 'ink.400'
  | 'ink.600'
  | 'darken.50'
  | 'darken.100'
  | 'darken.150'
  | 'red'
  | 'green'
  | 'orange'
  | 'cyan';

export type Colors = LiteralUnion<ThemeColorsStringLiteral, string>;

export type Spacing = LiteralUnion<NamedSpacingUnitsLiteral, string | number>;

export type Text = TextStylesLiteral;
