import { Flex, HStack, styled } from 'leather-styles/jsx';

import { BulletOperator } from '@app/ui/components/bullet-separator/bullet-separator';
import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

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
            <BulletOperator /> Microblock
          </styled.span>
          <BasicTooltip side="right" label={'Learn more about microblocks'}>
            <HStack>
              <a
                href="https://docs.stacks.co/understand-stacks/microblocks"
                target="_blank"
                rel="noreferrer"
              >
                <InfoIcon color="accent.text-subdued" ml="space.01" size="xs" />
              </a>
            </HStack>
          </BasicTooltip>
        </>
      ) : (
        ''
      )}
    </Flex>
  );
}
