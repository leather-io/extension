import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';
import { LeatherButton } from '@app/ui/components/button';

interface PrincipalValueProps {
  address: string;
}
export function PrincipalValue(props: PrincipalValueProps) {
  const { address } = props;
  const { mode } = useCurrentNetworkState();

  return (
    <LeatherButton
      onClick={() => openInNewTab(`https://explorer.hiro.so/address/${address}?chain=${mode}`)}
      textStyle="label.03"
      variant="link"
      wordBreak="break-all"
    >
      {address}
    </LeatherButton>
  );
}
