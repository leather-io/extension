import { Caption } from '@app/components/typography';
import { NoAssetsEmptyIllustration } from '@app/components/vector/no-assets';
import { Button, color, Stack, StackProps, useClipboard } from '@stacks/ui';
import { UserAreaSelectors } from '@tests/integration/user-area.selectors';

interface NoAssetProps extends StackProps {
  address: string;
}
export function NoAssets({ address, ...props }: NoAssetProps) {
  const { onCopy, hasCopied } = useClipboard(address || '');
  return (
    <Stack
      py="extra-loose"
      spacing="extra-loose"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <NoAssetsEmptyIllustration maxWidth="120px" />
      <Caption maxWidth="23ch" textAlign="center">
        Get started by sending some STX to your wallet.
      </Caption>
      <Button
        bg="#EEF2FB"
        _hover={{ bg: '#E5EBFA' }}
        color={color('brand')}
        borderRadius="10px"
        onClick={onCopy}
        data-testid={UserAreaSelectors.AccountBalancesCopyAddress}
      >
        {hasCopied ? 'Copied!' : 'Copy address'}
      </Button>
    </Stack>
  );
}
