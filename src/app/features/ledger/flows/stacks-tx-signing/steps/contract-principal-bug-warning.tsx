import { useContext } from 'react';

import GenericErrorImg from '@assets/images/generic-error.png';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { useLoading } from '@app/common/hooks/use-loading';
import { delay } from '@app/common/utils';
import { LeatherButton } from '@app/components/button/button';
import { Body } from '@app/components/typography';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';

import { ledgerTxSigningContext } from '../ledger-sign-tx.context';

export function ContractPrincipalBugWarning() {
  const { hasUserSkippedBuggyAppWarning } = useContext(ledgerTxSigningContext);
  const { /*isLoading,*/ setIsLoading, setIsIdle } = useLoading('temp-spinner-deep-link');
  return (
    <LedgerWrapper>
      <Box mb="space.02" mt="space.02">
        <img src={GenericErrorImg} width="106px" />
      </Box>
      <LedgerTitle mt="base-loose">Stacks Ledger app is outdated</LedgerTitle>
      <Body mt="space.04" mx="space.02">
        Some transactions are not compatible with outdated app versions. Update your app in{' '}
        <a href="ledgerlive://manager" style={{ textDecoration: 'underline' }}>
          Ledger Live
        </a>{' '}
        and try again.
      </Body>
      <HStack mb="space.05" mt="space.06">
        <styled.a
          href="ledgerlive://manager"
          // #4164 FIXME migrate isLoading if needed
          // isLoading={isLoading}
          onClick={async () => {
            setIsLoading();
            await delay(300);
            setIsIdle();
          }}
        >
          Open Ledger Live ↗
        </styled.a>
        <LeatherButton
          // #4164 FIXME migrate tertiary
          variant="ghost"
          // mode="tertiary"
          onClick={() => hasUserSkippedBuggyAppWarning.done('ignored-warning')}
        >
          Continue anyway
        </LeatherButton>
      </HStack>
    </LedgerWrapper>
  );
}
