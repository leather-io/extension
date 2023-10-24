import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { SupportedBlockchains } from '@shared/constants';

import { capitalize } from '@app/common/utils';
import { LeatherButton } from '@app/components/button/button';
import { LedgerIcon } from '@app/components/icons/ledger-icon';
import { immediatelyAttemptLedgerConnection } from '@app/features/ledger/hooks/use-when-reattempt-ledger-connection';

interface ConnectLedgerAssetBtnProps {
  chain: SupportedBlockchains;
}

export function ConnectLedgerAssetBtn({ chain }: ConnectLedgerAssetBtnProps) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`${chain}/connect-your-ledger`, {
      replace: true,
      state: { [immediatelyAttemptLedgerConnection]: true },
    });
  };
  return (
    <LeatherButton
      display="flex"
      alignItems="center"
      variant="outline"
      height="36px"
      gap="space.02"
      onClick={onClick}
    >
      <LedgerIcon />
      <styled.span textStyle="label.02">Connect&nbsp;{capitalize(chain)}</styled.span>
    </LeatherButton>
  );
}
