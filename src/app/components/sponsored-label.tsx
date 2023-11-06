import { FiAlertCircle } from 'react-icons/fi';

// FIXME figure out what bg-4 was
import { color } from '@stacks/ui';
import { HStack, Stack } from 'leather-styles/jsx';

export function SponsoredLabel(): React.JSX.Element {
  return (
    <Stack width="100%">
      <HStack alignItems="center" bg={color('bg-4')} borderRadius="10px" height="48px" pl="base">
        {/* <Box
          _hover={{ cursor: 'pointer' }}
          as={FiAlertCircle}
          color={color('accent')}
          size="16px"
        /> */}
        <FiAlertCircle width="16px" height="16px" />
        This transaction is sponsored, so no fee is charged
      </HStack>
    </Stack>
  );
}
