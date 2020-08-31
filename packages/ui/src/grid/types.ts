import { BoxProps } from '../box';

interface GridPropsBase {
  templateColumns?: BoxProps['gridTemplateColumns'];
  gap?: BoxProps['gap'];
  rowGap?: BoxProps['rowGap'];
  columnGap?: BoxProps['columnGap'];
  autoFlow?: BoxProps['gridAutoFlow'];
  autoRows?: BoxProps['gridAutoRows'];
  autoColumns?: BoxProps['gridAutoColumns'];
  templateRows?: BoxProps['gridTemplateRows'];
  templateAreas?: BoxProps['gridTemplateAreas'];
  area?: BoxProps['gridArea'];
  column?: BoxProps['gridColumn'];
  row?: BoxProps['gridRow'];
}

export type GridProps = BoxProps & GridPropsBase;
