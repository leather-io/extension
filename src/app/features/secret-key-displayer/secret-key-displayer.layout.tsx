import { FiCopy } from 'react-icons/fi';
import { Box, color, Stack } from '@stacks/ui';

import { Text, Title } from '@app/components/typography';
import { Link } from '@app/components/link';
import YourSecretKey from '@assets/images/onboarding/your-secret-key.png';

import { SecretKeyWord } from './components/secret-key-word';
import { SettingsSelectors } from '@tests/integration/settings.selectors';

interface SecretKeyDisplayerLayoutProps {
  hasCopied: boolean;
  onCopyToClipboard(): void;
  secretKeyWords: string[] | undefined;
  showTitleAndIllustration: boolean;
}
export function SecretKeyDisplayerLayout(props: SecretKeyDisplayerLayoutProps) {
  const { hasCopied, onCopyToClipboard, secretKeyWords, showTitleAndIllustration } = props;

  return (
    <Box border="1px solid" borderColor={color('border')} borderRadius="16px">
      <Stack
        alignItems="center"
        p={['base-loose', 'extra-loose']}
        ml={['tight', 'extra-tight']}
        spacing="loose"
      >
        {showTitleAndIllustration ? (
          <>
            <Box width={['87px', '101px']}>
              <img src={YourSecretKey} />
            </Box>
            <Title fontSize="20px">Your Secret Key</Title>
          </>
        ) : null}
        <Stack isInline justifyContent="center" rowGap="tight" wrap="wrap">
          {secretKeyWords?.map(word => (
            <SecretKeyWord key={word} word={word} />
          ))}
        </Stack>
        <Link
          data-testid={SettingsSelectors.CopyKeyToClipboardBtn}
          _hover={{ textDecoration: 'none' }}
          fontSize="14px"
          onClick={!hasCopied ? onCopyToClipboard : undefined}
        >
          <Stack alignItems="center" isInline>
            {!hasCopied && <FiCopy />}
            <Text color={color('accent')}>{!hasCopied ? ' Copy to clipboard' : 'Copied!'}</Text>
          </Stack>
        </Link>
      </Stack>
    </Box>
  );
}
