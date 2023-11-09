import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack, StackProps } from 'leather-styles/jsx';

export function CryptoAssetListLayout({ children }: StackProps) {
  return (
    <Stack
      width="100%"
      data-testid={CryptoAssetSelectors.CryptoAssetList}
      pb="space.06"
      px="space.05"
      gap="space.06"
    >
      {children}
    </Stack>
  );
}
