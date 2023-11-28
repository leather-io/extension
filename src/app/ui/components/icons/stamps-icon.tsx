import StampsIconImg from '@assets/images/stamps-icon.png';
import { Circle, CircleProps, styled } from 'leather-styles/jsx';

export function StampsIcon({ size = 'xl', ...props }: CircleProps) {
  return (
    <Circle border="default" size={size} {...props}>
      <styled.img src={StampsIconImg} width="80%" />
    </Circle>
  );
}
