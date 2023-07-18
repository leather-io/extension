import { FiCopy } from 'react-icons/fi';

import { Box, Button, ButtonProps, Flex, Stack } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { Flag } from '../layout/flag';
import { Caption } from '../typography';

interface ReceiveCollectibleItemProps extends ButtonProps {
  address: string;
  icon: React.JSX.Element;
  onCopyAddress(): void;
  title: string;
}
export function ReceiveCollectibleItem({
  address,
  icon,
  onCopyAddress,
  title,
  ...rest
}: ReceiveCollectibleItemProps) {
  return (
    <Flag img={icon} spacing="base">
      <Flex justifyContent="space-between">
        <Box>
          {title}
          <Caption mt="2px">{truncateMiddle(address, 6)}</Caption>
        </Box>
        <Stack>
          <Box>
            <Button borderRadius="10px" mode="tertiary" onClick={onCopyAddress} {...rest}>
              <FiCopy />
            </Button>
          </Box>
        </Stack>
      </Flex>
    </Flag>
  );
}
