import { Flex, FlexProps } from '@stacks/ui';

export function CenteredPageContainer(props: FlexProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent={['start', 'center', 'center']}
      mb="loose"
      {...props}
    />
  );
}
