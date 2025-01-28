import { useLocation, useNavigate } from 'react-router-dom';

import { HStack, styled } from 'leather-styles/jsx';

import type { Blockchain } from '@leather.io/models';
import { Button, LedgerIcon } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { immediatelyAttemptLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

interface ConnectLedgerButtonProps {
  chain: Blockchain;
}
export function ConnectLedgerButton({ chain }: ConnectLedgerButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    navigate(`${chain}/connect-your-ledger`, {
      replace: true,
      state: {
        [immediatelyAttemptLedgerConnection]: true,
        backgroundLocation: { pathname: RouteUrls.Home },
        fromLocation: location,
      },
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <HStack>
        <LedgerIcon />
        <styled.span textStyle="label.02">Connect&nbsp;{capitalize(chain)}</styled.span>
      </HStack>
    </Button>
  );
}
