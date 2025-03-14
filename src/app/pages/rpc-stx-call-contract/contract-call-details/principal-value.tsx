import { Link } from '@leather.io/ui';

import { makeStacksAddressExplorerLink } from '@app/common/utils';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface PrincipalValueProps {
  address: string;
}
export function PrincipalValue(props: PrincipalValueProps) {
  const { address } = props;
  const { chain, isNakamotoTestnet } = useCurrentNetworkState();

  return (
    <Link
      onClick={() =>
        openInNewTab(
          makeStacksAddressExplorerLink({
            mode: chain.bitcoin.mode,
            address,
            isNakamoto: isNakamotoTestnet,
          })
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
