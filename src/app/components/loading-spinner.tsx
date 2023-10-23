import { Spinner, SpinnerSize } from '@stacks/ui';
import { Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function LoadingSpinner(props: { size?: SpinnerSize } & FlexProps) {
  const { size = 'lg' } = props;
  return (
    <Flex alignItems="center" flexGrow={1} justifyContent="center" width="100%" {...props}>
      <Spinner color={token('colors.accent.text-subdued')} size={size} />
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
