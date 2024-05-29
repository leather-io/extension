import { Spinner } from '@leather-wallet/ui';
import { Flex, FlexProps } from 'leather-styles/jsx';

export function LoadingSpinner(props: { size?: string } & FlexProps) {
  return (
    <Flex alignItems="center" flexGrow={1} justifyContent="center" width="100%" {...props}>
      <Spinner size={props.size} />
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
