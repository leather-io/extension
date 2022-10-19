import { FiArrowRight } from 'react-icons/fi';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { Tooltip } from '@app/components/tooltip';
import { Body, Title } from '@app/components/typography';

import { externalLinkInfo, StepIllustration } from './suggested-first-step';

interface StepPopupProps {
  body: string;
  imagePopup: string;
  imagePopupDone: string;
  isComplete: boolean;
  isExternalRoute?: boolean;
  onClick(): void;
  title: string;
}
export function StepPopup(props: StepPopupProps) {
  const { body, imagePopup, imagePopupDone, isComplete, isExternalRoute, onClick, title } = props;

  return (
    <Stack
      _hover={{ cursor: !isComplete ? 'pointer' : 'unset' }}
      border={['1px solid', 'unset']}
      borderColor={color('border')}
      borderRadius={['10px', 'unset']}
      flexGrow={1}
      onClick={!isComplete ? onClick : undefined}
      pl={['base', 'unset']}
      pr="base"
      py={['base', 'unset']}
      spacing="base"
    >
      <Box height={['46px', '100px']} width={['55px', '132px']}>
        <StepIllustration image={isComplete ? imagePopupDone : imagePopup} />
      </Box>
      <Tooltip
        disabled={isComplete || !isExternalRoute}
        label={externalLinkInfo}
        maxWidth="250px"
        placement="top"
      >
        <Flex alignItems={['center', 'unset']} flexDirection={['unset', 'column']}>
          <Title
            color={isComplete ? color('text-caption') : color('text-title')}
            fontSize={[1, 2]}
            lineHeight="24px"
            mr="extra-tight"
          >
            {title}
          </Title>
          {isExternalRoute ? <Box as={FiArrowRight} transform={'rotate(-45deg)'} /> : null}
          <Body display={['none', 'block']} mt="tight">
            {body}
          </Body>
        </Flex>
      </Tooltip>
    </Stack>
  );
}
