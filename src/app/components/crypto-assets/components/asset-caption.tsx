import { Flex, HStack, styled } from 'leather-styles/jsx';

// #4476 TODO: test this tooltip + check with Fara
// maybe we can replace Tippy with radix tooltip eventually
import { Tooltip } from '@app/components/tooltip';
import { InfoIcon } from '@app/ui/components/icons/info-icon';

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
                <InfoIcon size="12px" ml={1} color="accent.text-subdued" />
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
