import { styled } from 'leather-styles/jsx';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <styled.span
      color={isEven ? 'accent.text-primary' : 'accent.border-hover'}
      fontFamily="Fira Code"
      mr="space.02"
      lineHeight="24px"
      {...props}
    />
  );
}
