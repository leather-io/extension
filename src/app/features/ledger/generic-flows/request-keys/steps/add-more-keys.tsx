import { useNavigate } from 'react-router-dom';

// #4164 FIXME migrate ButtonGroup
import { ButtonGroup } from '@stacks/ui';

import { LeatherButton } from '@app/components/button/button';
import { Caption } from '@app/components/typography';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';

export function AddMoreKeysLayout() {
  const navigate = useNavigate();
  return (
    <LedgerWrapper mb="space.05">
      <LedgerTitle mx="50px">Add Bitcoin keys</LedgerTitle>
      <ButtonGroup mt="space.05">
        <LeatherButton onClick={() => navigate('/get-started/bitcoin/connect-your-ledger')}>
          Continue to add Bitcoin keys
        </LeatherButton>
        <LeatherButton onClick={() => navigate('/')}>Go to homepage</LeatherButton>
      </ButtonGroup>
      <Caption mt="space.04">You'll need to have the Bitcoin app installed</Caption>
    </LedgerWrapper>
  );
}
