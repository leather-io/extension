import { FiInfo } from 'react-icons/fi';

// #4164 FIXME migrate Tooltip - use radix instead
import { Tooltip } from '@stacks/ui';
import { Flex, HStack } from 'leather-styles/jsx';
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
            <HStack>
              <a
                href="https://docs.stacks.co/understand-stacks/microblocks"
                target="_blank"
                rel="noreferrer"
              >
                <FiInfo
                  // #4164 FIXME check if we need cursor pointer
                  // _hover={{ cursor: 'pointer' }}
                  size="12px"
                  // #4164 FIXME check if we need this color
                  // color={token('colors.accent.text-subdued')}
                  style={{ marginLeft: '1px' }} // check this margin
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
