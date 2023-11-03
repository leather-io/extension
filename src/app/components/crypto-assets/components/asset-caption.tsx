import { FiInfo } from 'react-icons/fi';

import { Tooltip, color } from '@stacks/ui';
import { Box, Flex, HStack, styled } from 'leather-styles/jsx';

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
            <HStack>
              <a
                href="https://docs.stacks.co/understand-stacks/microblocks"
                target="_blank"
                rel="noreferrer"
              >
                {/* FIXME - refactor thsi to just be an icon! */}
                <Box
                  _hover={{ cursor: 'pointer' }}
                  width="12px"
                  height="12px"
                  color={color('text-caption')}
                  as={FiInfo}
                  ml={1}
                />
              </a>
            </HStack>
          </Tooltip>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}
