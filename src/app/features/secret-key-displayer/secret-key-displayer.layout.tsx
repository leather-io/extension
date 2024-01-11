import { useState } from 'react';

import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Flex, styled } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { CopyIcon } from '@app/ui/components/icons/copy-icon';
import { EyeIcon } from '@app/ui/components/icons/eye-icon';
import { EyeSlashIcon } from '@app/ui/components/icons/eye-slash-icon';

import { SecretKeyGrid } from '../../components/secret-key/secret-key-grid';
import { SecretKeyWord } from './components/secret-key-word';

interface SecretKeyDisplayerLayoutProps {
  hasCopied: boolean;
  onCopyToClipboard(): void;
  secretKeyWords: string[] | undefined;
  showTitleAndIllustration: boolean;
  onBackedUpSecretKey(): void;
}
export function SecretKeyDisplayerLayout(props: SecretKeyDisplayerLayoutProps) {
  const { hasCopied, onCopyToClipboard, onBackedUpSecretKey, secretKeyWords } = props;
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <>
      <SecretKeyGrid>
        {secretKeyWords?.map((word, index) => (
          <SecretKeyWord
            key={word}
            word={showSecretKey ? word : '*'.repeat(word.length)}
            num={index + 1}
          />
        ))}
      </SecretKeyGrid>
      <Flex gap="space.02" alignItems="center" width="100%">
        <Button
          variant="outline"
          flex="1"
          display="flex"
          px="space.04"
          py="space.03"
          justifyContent="center"
          alignItems="center"
          gap="space.02"
          data-testid={SettingsSelectors.ShowSecretKeyBtn}
          onClick={() => setShowSecretKey(!showSecretKey)}
        >
          {showSecretKey ? <EyeSlashIcon size="20px" /> : <EyeIcon size="20px" />}
          <styled.p textStyle="body.02">{showSecretKey ? 'Hide key' : 'Show key'}</styled.p>
        </Button>
        <Button
          variant="outline"
          flex="1"
          display="flex"
          px="space.04"
          py="space.03"
          justifyContent="center"
          alignItems="center"
          gap="space.02"
          data-testid={SettingsSelectors.CopyKeyToClipboardBtn}
          onClick={!hasCopied ? onCopyToClipboard : undefined}
        >
          <CopyIcon />
          <styled.p textStyle="body.02">{!hasCopied ? ' Copy' : 'Copied!'}</styled.p>
        </Button>
      </Flex>
      <Button
        width="100%"
        data-testid={OnboardingSelectors.BackUpSecretKeyBtn}
        onClick={onBackedUpSecretKey}
      >
        I've backed it up
      </Button>
    </>
  );
}
