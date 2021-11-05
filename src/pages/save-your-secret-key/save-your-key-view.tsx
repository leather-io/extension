import React, { memo } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Button, color, Stack, BoxProps, useClipboard, StackProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Body, Text } from '@components/typography';
import { Card } from '@components/card';
import { Header } from '@components/header';
import { useChangeScreen } from '@common/hooks/use-change-screen';
import { RouteUrls } from '@common/types';

const SecretKeyMessage: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  const wordCount = (secretKey || '').split(' ').length;
  return (
    <Body {...props} className="onboarding-text">
      These {wordCount} words are your Secret Key. They create your account, and you sign in on
      different devices with them. Make sure to save these somewhere safe.{' '}
      <Text display="inline" fontWeight={500}>
        If you lose these words, you lose your account.
      </Text>
    </Body>
  );
};

const SecretKeyCard: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  return (
    <Card title="Your Secret Key" {...props}>
      <Body data-testid="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
};

const SecretKeyActions: React.FC<{ handleNext?: () => void } & StackProps> = ({
  handleNext,
  ...rest
}) => {
  const { secretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  return (
    <Stack spacing="base" {...rest}>
      <Button
        data-testid="copy-key-to-clipboard"
        width="100%"
        border="1px solid"
        borderColor={color('border')}
        color={color(hasCopied ? 'text-caption' : 'brand')}
        mode="tertiary"
        borderRadius="10px"
        onClick={hasCopied ? undefined : onCopy}
      >
        {hasCopied ? 'Copied!' : 'Copy to clipboard'}
      </Button>
      {handleNext && (
        <Button
          width="100%"
          onClick={handleNext}
          data-testid="confirm-saved-key"
          borderRadius="10px"
        >
          I've saved it
        </Button>
      )}
    </Stack>
  );
};

// `handleNext` and the design of this component
// built on top of legacy from the earlier hosted version
// of connect. To be refactored.
export const SaveYourKeyView: React.FC<{
  handleNext?: () => void;
  onClose?: () => void;
  title?: string;
  hideActions?: boolean;
}> = memo(({ title, handleNext, hideActions, onClose }) => {
  const changeScreen = useChangeScreen();
  return (
    <PopupContainer
      header={
        <Header
          onClose={onClose}
          hideActions={hideActions}
          title={title || 'Save your Secret Key'}
        />
      }
    >
      <Stack spacing="loose">
        <SecretKeyMessage />
        <SecretKeyCard />
        <SecretKeyActions
          handleNext={handleNext || onClose || (() => changeScreen(RouteUrls.SetPassword))}
        />
      </Stack>
    </PopupContainer>
  );
});
