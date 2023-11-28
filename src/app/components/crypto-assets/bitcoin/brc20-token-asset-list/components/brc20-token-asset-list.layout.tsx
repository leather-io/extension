import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack, StackProps } from 'leather-styles/jsx';

export function Brc20AssetListLayout({ children }: StackProps) {
  return (
    <Stack
      width="100%"
      data-testid={CryptoAssetSelectors.CryptoAssetList}
      pt="space.06"
      px="space.05"
      gap="space.06"
    >
      {children}
    </Stack>
  );
}
