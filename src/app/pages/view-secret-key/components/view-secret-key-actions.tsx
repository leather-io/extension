import { Button, color, Stack, StackProps } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

interface ViewSecreteKeyActionsProps extends StackProps {
  hasCopied: boolean;
  onClick(): void;
  onCopyToClipboard(): void;
}
export function ViewSecretKeyActions(props: ViewSecreteKeyActionsProps): JSX.Element {
  const { hasCopied, onClick, onCopyToClipboard, ...rest } = props;

  return (
    <Stack width="100%" spacing="base" {...rest}>
      <Button
        _hover={{
          boxShadow: 'none',
        }}
        border="1px solid"
        borderColor={color('border')}
        borderRadius="10px"
        boxShadow="none"
        color={color(hasCopied ? 'text-caption' : 'brand')}
        data-testid="copy-key-to-clipboard"
        height="48px"
        onClick={hasCopied ? undefined : onCopyToClipboard}
        mode="tertiary"
      >
        {hasCopied ? 'Copied!' : 'Copy to clipboard'}
      </Button>
      <PrimaryButton onClick={onClick}>I've saved it</PrimaryButton>
    </Stack>
  );
}
