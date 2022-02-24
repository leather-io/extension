import { Flex, FlexProps } from '@stacks/ui';

export function CenteredPageContainer(props: FlexProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      height={['70vh', 'calc(90vh - 68px)']}
      justifyContent={['start', 'center']}
      mb="loose"
      {...props}
    />
  );
}
