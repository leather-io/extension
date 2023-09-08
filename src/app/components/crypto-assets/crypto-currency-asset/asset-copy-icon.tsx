import { FiCheck, FiCopy } from 'react-icons/fi';

import { UserAreaSelectors } from '@tests-legacy/integration/user-area.selectors';
import { Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface AssetItemCopyIconProps {
  hasCopied: boolean;
}

export function AssetItemCopyIcon({ hasCopied }: AssetItemCopyIconProps) {
  return (
    <Flex alignItems="center" justifyContent="center" width="36px" height="36px">
      {/* // #4164 FIXME refactor these icons to not duplicate - visual inspect + delete css*/}
      {hasCopied ? (
        <FiCheck
          size="16px"
          data-testid={UserAreaSelectors.AccountCopyAddress}
          color={token('colors.accent.text-subdued')}
          style={{ marginTop: '2px' }}
        />
      ) : (
        <FiCopy
          data-testid={UserAreaSelectors.AccountCopyAddress}
          size="16px"
          color={token('colors.accent.text-subdued')}
          style={{ marginTop: '2px' }}
        />
      )}
    </Flex>
  );
}
