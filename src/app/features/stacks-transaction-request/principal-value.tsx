import { Link } from '@leather-wallet/ui';

import { makeStacksAddressExplorerLink } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface PrincipalValueProps {
  address: string;
}
export function PrincipalValue(props: PrincipalValueProps) {
  const { address } = props;
  const { mode, isNakamotoTestnet } = useCurrentNetworkState();

  return (
    <Link
      onClick={() =>
        openInNewTab(
          makeStacksAddressExplorerLink({ mode, address, isNakamoto: isNakamotoTestnet })
        )
      }
      size="sm"
      variant="text"
      wordBreak="break-all"
    >
      {address}
    </Link>
  );
}
