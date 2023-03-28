import { FiCopy } from 'react-icons/fi';

import { Box, Stack, color, useClipboard } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';

import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { Caption } from '@app/components/typography';

interface PsbtDecodedNodeFooterProps {
  address: string;
  type: string;
}
export function PsbtDecodedNodeFooter({ address, type }: PsbtDecodedNodeFooterProps) {
  const { hasCopied, onCopy } = useClipboard(address);

  return (
    <SpaceBetween>
      <Caption>{type === 'input' ? 'From' : 'To'}</Caption>
      <Stack isInline>
        <Caption>{truncateMiddle(address, 4)}</Caption>
        <Tooltip hideOnClick={false} label={hasCopied ? 'Copied!' : 'Copy address'} placement="top">
          <Box
            _hover={{ cursor: 'pointer' }}
            as="button"
            color={color('text-caption')}
            onClick={onCopy}
            type="button"
          >
            <FiCopy />
          </Box>
        </Tooltip>
      </Stack>
    </SpaceBetween>
  );
}
