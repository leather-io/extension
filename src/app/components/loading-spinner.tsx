import { useEffect } from 'react';
import { color, Flex, FlexProps, Spinner } from '@stacks/ui';

import { useHasCreatedAccount } from '@app/store/accounts/account.hooks';

export function LoadingSpinner(props: FlexProps) {
  return (
    <Flex alignItems="center" flexGrow={1} justifyContent="center" width="100%" {...props}>
      <Spinner color={color('text-caption')} opacity={0.5} size="lg" />
    </Flex>
  );
}

export function FullPageLoadingSpinner(props: FlexProps) {
  return (
    <Flex height="100vh" {...props}>
      <LoadingSpinner />
    </Flex>
  );
}

export function NewAccountLoadingSpinner() {
  const [hasCreatedAccount, setHasCreatedAccount] = useHasCreatedAccount();

  useEffect(() => {
    hasCreatedAccount && setHasCreatedAccount(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <FullPageLoadingSpinner />;
}
