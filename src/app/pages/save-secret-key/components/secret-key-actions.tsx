import { Button, color, Stack, StackProps } from '@stacks/ui';

interface SecreteKeyActionsProps extends StackProps {
  hasCopied: boolean;
  onClick(): void;
  onCopyToClipboard(): void;
}
export function SecretKeyActions(props: SecreteKeyActionsProps): JSX.Element {
  const { hasCopied, onClick, onCopyToClipboard, ...rest } = props;

  return (
    <Stack width="100%" spacing="base" {...rest}>
      <Button
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
      <Button data-testid="confirm-saved-key" borderRadius="10px" height="48px" onClick={onClick}>
        I've saved it
      </Button>
    </Stack>
  );
}
