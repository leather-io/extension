import { Flex, FlexProps } from '@stacks/ui';

export function CenteredPageContainer(props: FlexProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      height={['70vh', '90vh']}
      justifyContent={['start', 'center']}
      mb="loose"
      {...props}
    />
  );
}
