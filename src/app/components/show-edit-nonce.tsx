import { color } from '@stacks/ui';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function ShowEditNonceAction() {
  const { isTestnet, name } = useCurrentNetworkState();
  const { isShowingEditNonce, setIsShowingEditNonce } = useDrawers();

  return (
    <SpaceBetween>
      <Caption
        _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        color={color('brand')}
        onClick={() => setIsShowingEditNonce(!isShowingEditNonce)}
      >
        Edit nonce
      </Caption>
      <Caption color="currentColor">{isTestnet ? name : 'Mainnet'}</Caption>
    </SpaceBetween>
  );
}

export function ShowEditNoncePlaceholder(): JSX.Element {
  return (
    <Caption _hover={{ cursor: 'not-allowed' }} color={color('brand')}>
      Loading...
    </Caption>
  );
}
