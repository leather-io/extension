import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Box, Circle, color, Stack } from '@stacks/ui';

import { Body, Caption, Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { isFullPage, isPopup } from '@app/common/utils';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

import { onboardingStepItemStyles } from '../home.styles';

const fullPageStepMaxWidth = '200px';
const popupPageStepWidth = '160px';
const popupPageStepMaxHeight = '167px';

interface StepIllustrationProps {
  image: string;
}
const StepIllustration = ({ image }: StepIllustrationProps) => <img src={image} />;

const PopupDoneIcon = () => (
  <Circle border="1px solid" borderColor={color('border')} color={color('bg')} size="40px">
    <FiCheck color={color('accent')} />
  </Circle>
);

interface OnboardingStepItemProps {
  body: string;
  imageFull: string;
  imagePopup: string;
  isDone: boolean;
  onClick(): void;
  title: string;
}
export function OnboardingStepItem(props: OnboardingStepItemProps) {
  const { body, imageFull, imagePopup, isDone, onClick, title } = props;

  return (
    <Stack
      _hover={{
        cursor: isPopup && !isDone ? 'pointer' : 'unset',
      }}
      border={['1px solid', 'unset']}
      borderColor={color('border')}
      borderRadius={['10px', 'unset']}
      className={onboardingStepItemStyles}
      flexGrow={1}
      maxHeight={[popupPageStepMaxHeight, 'unset']}
      maxWidth={['unset', fullPageStepMaxWidth]}
      onClick={isPopup && !isDone ? onClick : undefined}
      p={['base', 'unset']}
      spacing="base"
      width={[popupPageStepWidth, 'unset']}
    >
      <Box height={['46px', '100px']} width={['55px', '132px']}>
        {isFullPage ? (
          <StepIllustration image={imageFull} />
        ) : !isDone ? (
          <StepIllustration image={imagePopup} />
        ) : (
          <PopupDoneIcon />
        )}
      </Box>
      <Stack spacing="base-tight">
        <Title
          color={isPopup && isDone ? color('text-caption') : color('text-title')}
          lineHeight="24px"
        >
          {title}
        </Title>
        {isFullPage ? <Body>{body}</Body> : null}
      </Stack>
      {isFullPage ? (
        isDone ? (
          <Box
            data-testid={OnboardingSelectors.StepItemDone}
            border="2px solid"
            borderColor={color('bg-4')}
            borderRadius="25px"
            color={color('text-caption')}
            height="24px"
            width="62px"
          >
            <Stack
              alignItems="center"
              isInline
              height="100%"
              spacing="extra-tight"
              justifyContent="center"
            >
              <FiCheck />
              <Caption fontWeight={400} variant="c2">
                Done
              </Caption>
            </Stack>
          </Box>
        ) : (
          <Link
            data-testid={OnboardingSelectors.StepItemStart}
            _hover={{ textDecoration: 'none' }}
            fontSize="14px"
            mr="4px !important"
            onClick={onClick}
          >
            <Stack alignItems="center" isInline>
              <Text color={color('accent')} mb="0px !important" mr="extra-tight">
                Start
              </Text>
              <FiArrowRight color={color('accent')} />
            </Stack>
          </Link>
        )
      ) : null}
    </Stack>
  );
}
