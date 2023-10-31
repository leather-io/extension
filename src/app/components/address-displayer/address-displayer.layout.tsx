import { styled } from 'leather-styles/jsx';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <styled.span
      color={isEven ? 'accent.text-primary' : 'accent.text-subdued'}
      mr="tight"
      lineHeight="24px"
      textStyle="mono"
      {...props}
    />
  );
}
