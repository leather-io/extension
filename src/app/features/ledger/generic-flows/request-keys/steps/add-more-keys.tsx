import { useNavigate } from 'react-router-dom';

import { Button, ButtonGroup } from '@stacks/ui';

import { Caption } from '@app/components/typography';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';

export function AddMoreKeysLayout() {
  const navigate = useNavigate();
  return (
    <LedgerWrapper mb="loose">
      <LedgerTitle mx="50px">Add Bitcoin keys</LedgerTitle>
      <ButtonGroup mt="loose">
        <Button onClick={() => navigate('/get-started/bitcoin/connect-your-ledger')}>
          Continue to add Bitcoin keys
        </Button>
        <Button onClick={() => navigate('/')}>Go to homepage</Button>
      </ButtonGroup>
      <Caption mt="base">You'll need to have the Bitcoin app installed</Caption>
    </LedgerWrapper>
  );
}
