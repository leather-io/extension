import { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

import { Box, Flex, Text, color } from '@stacks/ui';

import { useOnOriginTabClose } from '@app/routes/hooks/use-on-tab-closed';

export function RequestingTabClosedWarningMessage() {
  const [hasTabClosed, setHasTabClosed] = useState(false);

  useOnOriginTabClose(() => {
    setHasTabClosed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (!hasTabClosed) return null;

  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiAlertCircle color={color('feedback-alert')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium" fontWeight={500}>
            Requesting window closed
          </Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
          >
            The window making this request closed, but you can still broadcast the transaction
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
