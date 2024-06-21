import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import type { Blockchains } from '@leather.io/models';
import { Button, LedgerIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { immediatelyAttemptLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

interface ConnectLedgerButtonProps {
  chain: Blockchains;
}
export function ConnectLedgerButton({ chain }: ConnectLedgerButtonProps) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`${chain}/connect-your-ledger`, {
      replace: true,
      state: {
        [immediatelyAttemptLedgerConnection]: true,
        backgroundLocation: { pathname: RouteUrls.Home },
      },
    });
  };

  return (
    <Button
      display="flex"
      alignItems="center"
      variant="outline"
      size="sm"
      gap="space.02"
      onClick={onClick}
    >
      <LedgerIcon />
      <styled.span textStyle="label.02">Connect&nbsp;{capitalize(chain)}</styled.span>
    </Button>
  );
}
