import { useState } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, Flex, Stack, styled } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

import { SecretKeyWord } from './components/secret-key-word';

interface SecretKeyDisplayerLayoutProps {
  hasCopied: boolean;
  onCopyToClipboard(): void;
  secretKeyWords: string[] | undefined;
  showTitleAndIllustration: boolean;
}
export function SecretKeyDisplayerLayout(props: SecretKeyDisplayerLayoutProps) {
  const { hasCopied, onCopyToClipboard, secretKeyWords, showTitleAndIllustration } = props;
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <Box backgroundColor="brown.1" border={['1px solid var(--brown-2)', '0px']} borderRadius="16px">
      <Stack
        alignItems="center"
        px={['space.02', 'space.05']}
        pt={['space.02', 'space.07']}
        pb={['space.02', 'space.05']}
        gap="space.07"
      >
        {showTitleAndIllustration ? (
          <styled.h1 hideBelow="sm" textStyle="heading.03">
            Your Secret Key
          </styled.h1>
        ) : null}

        <Flex justifyContent="center" rowGap="space.02" flexWrap="wrap" gap="space.01">
          {secretKeyWords?.map((word, index) => (
            <SecretKeyWord
              key={word}
              flex={['0 40%', '1 0 21%']}
              word={showSecretKey ? word : '*'.repeat(word.length)}
              num={index + 1}
            />
          ))}
        </Flex>
        <Flex gap="space.02" alignItems="center" width="100%">
          <LeatherButton
            variant="outline"
            flex="1"
            data-testid={SettingsSelectors.ShowSecretKeyBtn}
            onClick={() => setShowSecretKey(!showSecretKey)}
          >
            <styled.p textStyle="body.02">{showSecretKey ? 'Hide key' : 'Show key'}</styled.p>
          </LeatherButton>
          <LeatherButton
            variant="outline"
            flex="1"
            data-testid={SettingsSelectors.CopyKeyToClipboardBtn}
            onClick={!hasCopied ? onCopyToClipboard : undefined}
          >
            <styled.p textStyle="body.02">{!hasCopied ? ' Copy to clipboard' : 'Copied!'}</styled.p>
          </LeatherButton>
        </Flex>
      </Stack>
    </Box>
  );
}
