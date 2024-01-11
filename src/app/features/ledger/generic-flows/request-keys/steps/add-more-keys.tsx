import { useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';
import { Button } from '@app/ui/components/button/button';
import { Caption } from '@app/ui/components/typography/caption';
import { Capitalize } from '@app/ui/utils/capitalize';

import { useLedgerRequestKeysContext } from '../ledger-request-keys.context';

export function AddMoreKeysLayout() {
  const navigate = useNavigate();

  const { chain } = useLedgerRequestKeysContext();

  const addKeysChain = chain === 'stacks' ? 'bitcoin' : 'stacks';

  return (
    <LedgerWrapper gap="space.05">
      <LedgerTitle mb="space.05">
        <Capitalize>{chain}</Capitalize> connected successfully. Would you like to connect{' '}
        <Capitalize>{addKeysChain}</Capitalize>?
      </LedgerTitle>
      <Stack gap="space.04" mb="space.04">
        <Button onClick={() => navigate(`/get-started/${addKeysChain}/connect-your-ledger`)}>
          Connect <Capitalize>{addKeysChain}</Capitalize>
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          No, continue to Leather
        </Button>
      </Stack>

      <Caption>
        You'll need to have the <Capitalize>{addKeysChain}</Capitalize> app installed and opened
      </Caption>
    </LedgerWrapper>
  );
}
