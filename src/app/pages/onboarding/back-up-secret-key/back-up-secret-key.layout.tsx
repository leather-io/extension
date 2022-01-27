import { useMemo } from 'react';
import { FiCopy } from 'react-icons/fi';
import { Box, color, Flex, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import { isFullPage, isPopup } from '@app/common/utils';
import { CenteredPageContainer } from '@app/components/centered-page-container';
import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';
import { PageTitle } from '@app/components/page-title';
import BackUpSecretKey from '@assets/images/onboarding/back-up-secret-key.svg';
import YourSecretKey from '@assets/images/onboarding/your-secret-key.svg';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { BackUpSecretKeyActions } from './components/back-up-secret-key-actions';
import { SecretKeyWord } from './components/secret-key-word';

interface BackUpSecretKeyLayoutProps {
  hasCopied: boolean;
  onBackedUpSecretKey(): void;
  onCopyToClipboard(): void;
  secretKey: string | undefined;
}
export function BackUpSecretKeyLayout(props: BackUpSecretKeyLayoutProps): JSX.Element {
  const { hasCopied, onBackedUpSecretKey, onCopyToClipboard, secretKey } = props;
  useRouteHeader(<Header hideActions />);

  const secretKeyWords = useMemo(() => secretKey?.split(' '), [secretKey]);

  return (
    <CenteredPageContainer>
      <Stack isInline={isFullPage} pb="loose" width="100%">
        <Flex
          alignItems={['start', 'center']}
          flexGrow={1}
          justifyContent="center"
          mt={['base', 'unset']}
        >
          <Stack maxWidth={CENTERED_FULL_PAGE_MAX_WIDTH} spacing="loose">
            <Box width={['142px', '183px']}>
              <img src={BackUpSecretKey} />
            </Box>
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
          alignItems={['start', 'center']}
          flexGrow={1}
          justifyContent="center"
          mt={['base', 'unset']}
        >
          <Box border="1px solid" borderColor={color('border')} borderRadius="16px" width="446px">
            <Stack
              alignItems="center"
              p={['base-loose', 'extra-loose']}
              ml={['tight', 'extra-tight']}
              spacing="loose"
            >
              <Box width={['87px', '101px']}>
                <img src={YourSecretKey} />
              </Box>
              <Title fontSize="20px">Your Secret Key</Title>
              <Stack isInline justifyContent="center" rowGap="tight" wrap="wrap">
                {secretKeyWords?.map(word => (
                  <SecretKeyWord word={word} />
                ))}
              </Stack>
              <Link
                _hover={{ textDecoration: 'none' }}
                fontSize="14px"
                onClick={!hasCopied ? onCopyToClipboard : undefined}
              >
                <Stack alignItems="center" isInline>
                  {!hasCopied && <FiCopy />}
                  <Text color={color('accent')}>
                    {!hasCopied ? ' Copy to clipboard' : 'Copied!'}
                  </Text>
                </Stack>
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
    </CenteredPageContainer>
  );
}
