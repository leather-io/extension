import { styled } from 'leather-styles/jsx';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <styled.span
      color={isEven ? 'ink.text-primary' : 'ink.text-subdued'}
      mr="space.02"
      textStyle="mono.01"
      {...props}
    />
  );
}
