import { useNavigate } from 'react-router-dom';

import { Stack } from 'leather-styles/jsx';

import { LeatherButton } from '@app/components/button/button';
import { Capitalize } from '@app/components/text/capitalize';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';
import { Caption } from '@app/ui/components/typography/caption';

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
        <LeatherButton onClick={() => navigate(`/get-started/${addKeysChain}/connect-your-ledger`)}>
          Connect <Capitalize>{addKeysChain}</Capitalize>
        </LeatherButton>
        <LeatherButton variant="outline" onClick={() => navigate('/')}>
          No, continue to Leather
        </LeatherButton>
      </Stack>

      <Caption>
        You'll need to have the <Capitalize>{addKeysChain}</Capitalize> app installed and opened
      </Caption>
    </LedgerWrapper>
  );
}
