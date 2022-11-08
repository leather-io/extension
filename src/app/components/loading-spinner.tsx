import { useEffect } from 'react';

import { Flex, FlexProps, Spinner, color } from '@stacks/ui';

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
    <Flex height="100vh" width="100%" {...props}>
      <LoadingSpinner />
    </Flex>
  );
}

export function FullPageWithHeaderLoadingSpinner(props: FlexProps) {
  return (
    <Flex height="calc(100vh - 68px)" width="100%" {...props}>
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
