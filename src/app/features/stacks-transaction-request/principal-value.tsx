import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { Link } from '@app/ui/components/link/link';

interface PrincipalValueProps {
  address: string;
}
export function PrincipalValue(props: PrincipalValueProps) {
  const { address } = props;
  const { mode } = useCurrentNetworkState();

  return (
    <Link
      onClick={() => openInNewTab(`https://explorer.hiro.so/address/${address}?chain=${mode}`)}
      size="sm"
      variant="text"
      wordBreak="break-all"
    >
      {address}
    </Link>
  );
}
