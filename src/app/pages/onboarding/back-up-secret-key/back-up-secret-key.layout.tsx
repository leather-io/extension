import { cx } from '@emotion/css';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { isFullPage, isPopup } from '@app/common/utils';
import { PageTitle } from '@app/components/page-title';
import KeyIllustrationFull from '@assets/images/onboarding/key-illustration-full.svg';
import KeyIllustrationPopup from '@assets/images/onboarding/key-illustration-popup.svg';
import SecretKey from '@assets/images/onboarding/secret-key.svg';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';
import { fullPageOnboardingContent, popupPageContent } from '@app/pages/pages.styles';
import { FULL_PAGE_MAX_WIDTH } from '@shared/styles-constants';

import { BackUpSecretKeyActions } from './components/back-up-secret-key-actions';

const KeyIllustration = () =>
  isFullPage ? <img src={KeyIllustrationFull} /> : <img src={KeyIllustrationPopup} />;

interface BackUpSecretKeyLayoutProps {
  hasCopied: boolean;
  onBackedUpSecretKey(): void;
  onCopyToClipboard(): void;
  secretKey: string | undefined;
}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): JSX.Element {
  const { hasCopied, onBackedUpSecretKey, onCopyToClipboard, secretKey } = props;
  useRouteHeader(<Header hideActions />);

  return (
    <Stack isInline={isFullPage} width="100%">
      <Flex
        className={cx({ [fullPageOnboardingContent]: isFullPage }, { [popupPageContent]: isPopup })}
        flexGrow={1}
        justifyContent="center"
      >
        <Stack maxWidth={`${FULL_PAGE_MAX_WIDTH}px`} spacing="loose">
          <img src={SecretKey} width="135px" />
          <PageTitle>Back up your Secret Key</PageTitle>
          <Text>
            Here’s your Secret Key: 24 words that generated your Stacks account. You’ll need it to
            access your account on a new device, in a different wallet, or in case you lose your
            password — so back it up somewhere safe.
          </Text>
          {isFullPage && <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />}
        </Stack>
      </Flex>
      <Flex
        className={cx({ [fullPageOnboardingContent]: isFullPage }, { [popupPageContent]: isPopup })}
        flexGrow={1}
        justifyContent="center"
      >
        <Box
          border="1px solid"
          borderColor={color('border')}
          borderRadius="16px"
          height="484px"
          width="432px"
        >
          <Stack alignItems="center" pt="80px" spacing="loose">
            <KeyIllustration />
            <Title fontSize="20px">Your Secret Key</Title>
            <Text px="loose" textAlign="center">
              {secretKey}
            </Text>
            <Link fontSize="14px" onClick={!hasCopied ? onCopyToClipboard : undefined}>
              {!hasCopied ? 'Copy to clipboard' : 'Copied!'}
            </Link>
          </Stack>
        </Box>
      </Flex>
      {isPopup && (
        <Stack mt="loose" spacing="loose">
          <BackUpSecretKeyActions onBackedUpSecretKey={onBackedUpSecretKey} />
        </Stack>
      )}
    </Stack>
  );
}
