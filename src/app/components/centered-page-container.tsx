import { Flex, FlexProps } from 'leather-styles/jsx';

export function CenteredPageContainer(props: FlexProps) {
  return (
    <Flex
      alignItems={['left', 'center']}
      flexGrow={1}
      flexDirection="column"
      minHeight={['70vh', '90vh']}
      justifyContent={['start', 'center', 'center']}
      mb="space.05"
      {...props}
    />
  );
}
