import { FiArrowRight } from 'react-icons/fi';

import { Box, Flex, Stack, color } from '@stacks/ui';
import { OnboardingSelectors } from '@tests-legacy/integration/onboarding/onboarding.selectors';

import { Link } from '@app/components/link';
import { Tooltip } from '@app/components/tooltip';
import { Body, Text, Title } from '@app/components/typography';

import { StepDoneBadge } from './step-done-badge';
import { StepIllustration, externalLinkInfo } from './suggested-first-step';

interface StepFullPageProps {
  action: string;
  body: string;
  imageFull: string;
  imageFullDone: string;
  isComplete: boolean;
  isExternalRoute?: boolean;
  onClick(): void;
  title: string;
}
export function StepFullPage(props: StepFullPageProps) {
  const { action, body, imageFull, imageFullDone, isComplete, isExternalRoute, onClick, title } =
    props;

  return (
    <Stack
      border={['1px solid', 'unset']}
      borderColor={color('border')}
      borderRadius={['10px', 'unset']}
      flexGrow={1}
      pl={['base', 'unset']}
      pr="base"
      py={['base', 'unset']}
      spacing="base"
    >
      <Box height={['46px', '100px']} width={['55px', '132px']}>
        <StepIllustration image={isComplete ? imageFullDone : imageFull} />
      </Box>
      <Flex alignItems={['center', 'unset']} flexDirection={['unset', 'column']}>
        <Title
          color={isComplete ? color('text-caption') : color('text-title')}
          fontSize={[1, 2]}
          lineHeight="24px"
          mr="extra-tight"
        >
          {title}
        </Title>
        <Body display={['none', 'block']} mt="tight">
          {body}
        </Body>
      </Flex>
      {isComplete ? (
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
              disabled={!isExternalRoute}
              label={externalLinkInfo}
              maxWidth="250px"
              placement="top"
            >
              <Flex alignItems="center">
                <Text color={color('accent')} fontWeight={500} mr="extra-tight">
                  {action}
                </Text>
                {isExternalRoute ? <Box as={FiArrowRight} transform="rotate(-45deg)" /> : null}
              </Flex>
            </Tooltip>
          </Flex>
        </Link>
      )}
    </Stack>
  );
}
