import { useNavigate } from 'react-router-dom';

import { Flex } from '@stacks/ui';

import { LeatherButton } from '@app/components/button/button';
import { ExternalLink } from '@app/components/external-link';
import { WarningLabel } from '@app/components/warning-label';

export function SwapMagicAuthorizeMessage() {
  const navigate = useNavigate();

  return (
    <WarningLabel mb="base" title="Please, authorize Magic before continuing">
      Swaps between BTC and xBTC use the{' '}
      <ExternalLink href="https://magicstx.gitbook.io" textDecoration="underline">
        Magic
      </ExternalLink>{' '}
      protocol. Before swapping with Magic, you must authorize your address.
      <Flex justifyContent="right">
        <LeatherButton marginTop={10} onClick={() => navigate('swap/magic/auth')}>
          Authorize
        </LeatherButton>
      </Flex>
    </WarningLabel>
  );
}
