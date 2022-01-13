import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Box, Circle, color, Flex, Stack, useMediaQuery } from '@stacks/ui';

import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Tooltip } from '@app/components/tooltip';
import { Body, Caption, Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';
import { RouteType } from '@shared/models/onboarding-types';

const externalLinkInfo =
  'This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC.';

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
  action: string;
  body: string;
  imageFull: string;
  imagePopup: string;
  isDone: boolean;
  onClick(): void;
  routeType: number;
  title: string;
}
export function OnboardingStepItem(props: OnboardingStepItemProps) {
  const { action, body, imageFull, imagePopup, isDone, onClick, routeType, title } = props;

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  return (
    <Stack
      _hover={{ cursor: !desktopViewport && !isDone ? 'pointer' : 'unset' }}
      border={['1px solid', 'unset']}
      borderColor={color('border')}
      borderRadius={['10px', 'unset']}
      flexGrow={1}
      onClick={!desktopViewport && !isDone ? onClick : undefined}
      pl={['base', 'unset']}
      pr="base"
      py={['base', 'unset']}
      spacing="base"
    >
      <Box height={['46px', '100px']} width={['55px', '132px']}>
        {desktopViewport ? (
          <StepIllustration image={imageFull} />
        ) : !isDone ? (
          <StepIllustration image={imagePopup} />
        ) : (
          <PopupDoneIcon />
        )}
      </Box>
      <Flex flexDirection="column">
        <Title
          color={!desktopViewport && isDone ? color('text-caption') : color('text-title')}
          fontSize={[1, 2]}
          lineHeight="24px"
        >
          {title}
        </Title>
        <Body display={['none', 'block']} mt="tight">
          {body}
        </Body>
      </Flex>
      {desktopViewport ? (
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
              height="100%"
              isInline
              justifyContent="center"
              spacing="extra-tight"
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
            <Flex alignItems="center">
              <Tooltip
                disabled={routeType !== RouteType.External}
                label={externalLinkInfo}
                maxWidth="250px"
                placement="top"
              >
                <Flex alignItems="center">
                  <Text color={color('accent')} fontWeight={500} mr="extra-tight">
                    {action}
                  </Text>
                  <Box
                    as={FiArrowRight}
                    transform={routeType === RouteType.External ? 'rotate(-45deg)' : 'unset'}
                  />
                </Flex>
              </Tooltip>
            </Flex>
          </Link>
        )
      ) : null}
    </Stack>
  );
}
