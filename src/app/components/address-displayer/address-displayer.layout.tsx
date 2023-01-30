import { Box } from '@stacks/ui';

interface AddressDisplayerLayoutProps {
  isEven: boolean;
  children: React.ReactNode;
}
export function AddressDisplayerLayout({ isEven, ...props }: AddressDisplayerLayoutProps) {
  return (
    <Box
      as="span"
      color={isEven ? '#74777D' : '#242629'}
      fontFamily="Fira Code"
      mr="tight"
      {...props}
    />
  );
}
