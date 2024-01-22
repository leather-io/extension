import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';
import { RouteUrls } from '@shared/route-urls';

import { capitalize } from '@app/common/utils';
import { immediatelyAttemptLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';
import { Button } from '@app/ui/components/button/button';
import { LedgerIcon } from '@app/ui/components/icons/ledger-icon';

interface ConnectLedgerAssetBtnProps {
  chain: SupportedBlockchains;
}

export function ConnectLedgerAssetBtn({ chain }: ConnectLedgerAssetBtnProps) {
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
