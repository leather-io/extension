import { SizeToken } from 'leather-styles/tokens';
import type { HTMLStyledProps, LiteralUnion } from 'leather-styles/types';

type IconSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Size = LiteralUnion<Extract<SizeToken, IconSizes>, string>;

export interface SvgProps extends HTMLStyledProps<'svg'> {
  size?: Size;
}
