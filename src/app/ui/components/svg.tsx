import { styled } from 'leather-styles/jsx';
import { HTMLStyledProps } from 'leather-styles/types';

export type SvgProps = HTMLStyledProps<'svg'>;

export function Svg(props: SvgProps) {
  return <styled.svg {...props} />;
}
