import { Stack, StackProps } from '@stacks/ui';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { CENTERED_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

export function CryptoAssetListLayout({ children }: StackProps) {
  return (
    <Stack
      data-testid={CryptoAssetSelectors.CryptoAssetList}
      minWidth={['unset', 'unset', CENTERED_FULL_PAGE_MAX_WIDTH]}
      pb="extra-loose"
      px="loose"
      spacing="extra-loose"
    >
      {children}
    </Stack>
  );
}
