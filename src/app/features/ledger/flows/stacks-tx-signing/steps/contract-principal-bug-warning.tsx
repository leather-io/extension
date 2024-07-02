import GenericErrorImg from '@assets/images/generic-error.png';
import { Box, HStack, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';
import { delay } from '@leather.io/utils';

import { useLoading } from '@app/common/hooks/use-loading';
import { LedgerTitle } from '@app/features/ledger/components/ledger-title';
import { LedgerWrapper } from '@app/features/ledger/components/ledger-wrapper';

import { useLedgerTxSigningContext } from '../../../generic-flows/tx-signing/ledger-sign-tx.context';

export function ContractPrincipalBugWarning() {
  const context = useLedgerTxSigningContext();
  const { isLoading, setIsLoading, setIsIdle } = useLoading('temp-spinner-deep-link');
  if (context.chain !== 'stacks') return null;
  return (
    <LedgerWrapper>
      <Box mx="space.02">
        <img src={GenericErrorImg} width="106px" />
      </Box>
      <LedgerTitle mt="space.04">Stacks Ledger app is outdated</LedgerTitle>
      <styled.span mt="space.04" mx="space.02" textStyle="body.02">
        Some transactions are not compatible with outdated app versions. Update your app in{' '}
        <a href="ledgerlive://manager" style={{ textDecoration: 'underline' }}>
          Ledger Live
        </a>{' '}
        and try again.
      </styled.span>
      <HStack mb="space.05" mt="space.06">
        <styled.a
          aria-busy={isLoading}
          href="ledgerlive://manager"
          onClick={async () => {
            setIsLoading();
            await delay(300);
            setIsIdle();
          }}
        >
          Open Ledger Live ↗
        </styled.a>
        <Button
          onClick={() => context.hasUserSkippedBuggyAppWarning.done('ignored-warning')}
          variant="outline"
        >
          Continue anyway
        </Button>
      </HStack>
    </LedgerWrapper>
  );
}
