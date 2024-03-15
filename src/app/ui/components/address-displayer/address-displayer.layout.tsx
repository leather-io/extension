import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

interface AddressDisplayerLayoutProps extends HTMLStyledProps<'span'> {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <styled.span
      color={isEven ? 'ink.text-primary' : 'ink.text-subdued'}
      mr="space.02"
      textStyle="code"
      {...props}
    />
  );
}
