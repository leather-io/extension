import { Box, BoxProps } from '@stacks/ui';

import { useAppDetails } from '@app/common/hooks/auth/use-app-details';
import { Image } from '@app/components/image';

export function AppIcon(props: BoxProps) {
  const { name, icon } = useAppDetails();
  return (
    <Box size={'24px'} mx="auto" {...props}>
      <Image src={icon} alt={name} />
    </Box>
  );
}
