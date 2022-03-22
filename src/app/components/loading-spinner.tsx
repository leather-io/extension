import { color, Flex, FlexProps, Spinner } from '@stacks/ui';

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
