import { Flex, transition } from '@stacks/ui';

export function Overlay() {
  return (
    <Flex
      alignItems={['flex-end', 'center', 'center']}
      bg="rgba(0,0,0,0.4)"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      left={0}
      position="fixed"
      pt="loose"
      top={0}
      transition={transition}
      width="100%"
      zIndex={1000}
    />
  );
}
