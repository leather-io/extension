import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';
import { Stack, StackProps } from 'leather-styles/jsx';

export function Brc20AssetListLayout({ children }: StackProps) {
  return (
    <Stack data-testid={CryptoAssetSelectors.CryptoAssetList} width="100%" paddingX="space.03">
      {children}
    </Stack>
  );
}
