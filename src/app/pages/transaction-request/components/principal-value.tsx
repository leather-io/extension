import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { Link } from '@app/components/link';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

interface PrincipalValueProps {
  address: string;
}
export function PrincipalValue(props: PrincipalValueProps) {
  const { address, ...rest } = props;
  const { mode } = useCurrentNetworkState();

  return (
    <Link
      fontSize={2}
      fontWeight={500}
      lineHeight="1.6"
      wordBreak="break-all"
      onClick={() => openInNewTab(`https://explorer.hiro.so/address/${address}?chain=${mode}`)}
      {...rest}
    >
      {address}
    </Link>
  );
}
