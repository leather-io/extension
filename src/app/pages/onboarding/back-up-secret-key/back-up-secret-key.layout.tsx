import { cx } from '@emotion/css';
import { FiEyeOff, FiLock, FiRotateCcw } from 'react-icons/fi';
import { Box, Button, color, Flex, Stack } from '@stacks/ui';

import { Caption, Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { isFullPage, isPopup } from '@app/common/utils';
import KeyIllustrationFull from '@assets/images/onboarding/key-illustration-full.svg';
import KeyIllustrationPopup from '@assets/images/onboarding/key-illustration-popup.svg';
import SecretKey from '@assets/images/onboarding/secret-key.svg';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import {
  fullPageContentText,
  fullPageTitle,
  popupContentText,
  popupTitle,
} from './back-up-secret-key.styles';

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
        className={cx({ [fullPageContentText]: isFullPage }, { [popupContentText]: isPopup })}
        flexGrow={1}
        justifyContent="center"
      >
        <Stack maxWidth="440px" spacing="loose">
          <img src={SecretKey} width="135px" />
          <Title
            className={cx({ [fullPageTitle]: isFullPage }, { [popupTitle]: isPopup })}
            fontWeight={500}
          >
            Back up your Secret Key
          </Title>
          <Text>
            Here’s your Secret Key: 24 words that generated your Stacks account. You’ll need it to
            access your account on a new device, in a different wallet, or in case you lose your
            password — so back it up somewhere safe.
          </Text>
          <Stack alignItems="center" isInline>
            <Box as={FiRotateCcw} color={color('text-caption')} size="12px" />
            <Caption>Your Secret Key gives access to your account</Caption>
          </Stack>
          <Stack alignItems="center" isInline>
            <Box as={FiEyeOff} color={color('text-caption')} size="12px" />
            <Caption>Never share your Secret Key</Caption>
          </Stack>
          <Stack alignItems="center" isInline>
            <Box as={FiLock} color={color('text-caption')} size="12px" />
            <Caption>Put it somewhere private and secure</Caption>
          </Stack>
          <Stack alignItems={isFullPage ? 'center' : 'start'} isInline={isFullPage} spacing="loose">
            <Button
              borderRadius="10px"
              height="48px"
              mr="24px !important"
              onClick={onBackedUpSecretKey}
              width="198px"
            >
              I've backed it up
            </Button>
            <Stack isInline alignItems="center">
              <Caption mr="4px !important">Or</Caption>
              <Link fontSize="14px" onClick={() => {}}>
                back it up later
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
      <Flex
        className={cx({ [fullPageContentText]: isFullPage }, { [popupContentText]: isPopup })}
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
            {isFullPage ? <img src={KeyIllustrationFull} /> : <img src={KeyIllustrationPopup} />}
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
    </Stack>
  );
}
