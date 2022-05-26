import { FiArrowRight } from 'react-icons/fi';
import { Box, color, Flex, Stack, useMediaQuery } from '@stacks/ui';

import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { Tooltip } from '@app/components/tooltip';
import { Body, Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';
import { RouteType } from '@shared/models/onboarding-types';

import { StepDoneBadge } from './step-done-badge';

const externalLinkInfo =
  'This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC.';

interface StepIllustrationProps {
  image: string;
}
const StepIllustration = ({ image }: StepIllustrationProps) => <img src={image} />;

interface OnboardingStepItemProps {
  action: string;
  body: string;
  imageFull: string;
  imageFullDone: string;
  imagePopup: string;
  imagePopupDone: string;
  isDone: boolean;
  onClick(): void;
  routeType: number;
  title: string;
}
export function OnboardingStepItem(props: OnboardingStepItemProps) {
  const {
    action,
    body,
    imageFull,
    imageFullDone,
    imagePopup,
    imagePopupDone,
    isDone,
    onClick,
    routeType,
    title,
  } = props;

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
          <StepIllustration image={isDone ? imageFullDone : imageFull} />
        ) : (
          <StepIllustration image={isDone ? imagePopupDone : imagePopup} />
        )}
      </Box>
      <Tooltip
        disabled={desktopViewport || routeType !== RouteType.External}
        label={externalLinkInfo}
        maxWidth="250px"
        placement="top"
      >
        <Flex alignItems={['center', 'unset']} flexDirection={['unset', 'column']}>
          <Title
            color={isDone ? color('text-caption') : color('text-title')}
            fontSize={[1, 2]}
            lineHeight="24px"
            mr="extra-tight"
          >
            {title}
          </Title>
          {!desktopViewport && routeType === RouteType.External ? (
            <Box as={FiArrowRight} transform={'rotate(-45deg)'} />
          ) : null}
          <Body display={['none', 'block']} mt="tight">
            {body}
          </Body>
        </Flex>
      </Tooltip>
      {desktopViewport ? (
        isDone ? (
          <StepDoneBadge />
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
                  {routeType === RouteType.External ? (
                    <Box as={FiArrowRight} transform="rotate(-45deg)" />
                  ) : null}
                </Flex>
              </Tooltip>
            </Flex>
          </Link>
        )
      ) : null}
    </Stack>
  );
}
