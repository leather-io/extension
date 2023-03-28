import { FiSettings } from 'react-icons/fi';

import { Box, Flex, Text, color } from '@stacks/ui';

interface PsbtDecodedRequestViewToggleProps {
  onSetShowAdvancedView(): void;
  showAdvancedView: boolean;
}
export function PsbtDecodedRequestViewToggle({
  onSetShowAdvancedView,
  showAdvancedView,
}: PsbtDecodedRequestViewToggleProps) {
  return (
    <Flex
      _hover={{ cursor: 'pointer' }}
      as="button"
      onClick={onSetShowAdvancedView}
      px="loose"
      width="100%"
    >
      <Text color={color('text-caption')} display="block" fontSize={1} py="tight">
        {showAdvancedView ? 'Hide advanced view' : 'Show advanced view'}
      </Text>
      <Box marginLeft="auto" marginTop="auto" marginBottom="auto">
        <FiSettings color={showAdvancedView ? color('accent') : color('text-caption')} />
      </Box>
    </Flex>
  );
}
