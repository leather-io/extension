import { color, Flex, FlexProps, Spinner } from '@stacks/ui';

export const LoadingSpinner = (props: FlexProps) => {
  return (
    <Flex alignItems="center" flexGrow={1} justifyContent="center" width="100%" {...props}>
      <Spinner color={color('text-caption')} opacity={0.5} size="lg" />
    </Flex>
  );
};
