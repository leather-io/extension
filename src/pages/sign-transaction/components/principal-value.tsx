import React from 'react';

import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { openInNewTab } from '@common/utils/open-in-new-tab';
import { Link } from '@components/link';

interface PrincipalValueProps {
  address: string;
}

export function PrincipalValue(props: PrincipalValueProps): JSX.Element {
  const { address, ...rest } = props;
  const { mode } = useCurrentNetwork();

  return (
    <Link
      fontSize={2}
      fontWeight={500}
      lineHeight="1.6"
      wordBreak="break-all"
      onClick={() => openInNewTab(`https://explorer.stacks.co/address/${address}?chain=${mode}`)}
      {...rest}
    >
      {address}
    </Link>
  );
}
