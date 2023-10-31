import { Flex, FlexProps } from 'leather-styles/jsx';

export function CenteredPageContainer(props: FlexProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      justifyContent={['start', 'center', 'center']}
      mb="space.05"
      minHeight={['70vh', '90vh']}
      {...props}
    />
  );
}
