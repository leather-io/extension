import { Stack, StackProps } from '@stacks/ui';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

export function CryptoAssetListLayout({ children }: StackProps) {
  return (
    <Stack
      width="100%"
      data-testid={CryptoAssetSelectors.CryptoAssetList}
      pb="extra-loose"
      px="loose"
      spacing="extra-loose"
    >
      {children}
    </Stack>
  );
}
