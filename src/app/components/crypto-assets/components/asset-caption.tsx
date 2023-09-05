import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Stack, Tooltip, color } from '@stacks/ui';
import { styled } from 'leather-styles/jsx';

interface AssetCaptionProps {
  caption: string;
  isUnanchored?: boolean;
}
export function AssetCaption({ caption, isUnanchored }: AssetCaptionProps) {
  return (
    <Flex flexDirection="row">
      <styled.span textStyle="caption.02">{caption}</styled.span>{' '}
      {isUnanchored ? (
        <>
          <styled.span mx="space.01" textStyle="caption.02">
            • Microblock
          </styled.span>
          <Tooltip placement="right-end" label={'Learn more about microblocks'}>
            <Stack isInline>
              <a
                href="https://docs.stacks.co/understand-stacks/microblocks"
                target="_blank"
                rel="noreferrer"
              >
                <Box
                  _hover={{ cursor: 'pointer' }}
                  size="12px"
                  color={color('text-caption')}
                  as={FiInfo}
                  ml={1}
                />
              </a>
            </Stack>
          </Tooltip>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}
