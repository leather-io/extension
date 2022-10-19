import { Box } from '@stacks/ui';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <Box
      fontFamily="Fira Code"
      as="span"
      color={isEven ? '#74777D' : '#242629'}
      mr="tight"
      {...props}
    />
  );
}
