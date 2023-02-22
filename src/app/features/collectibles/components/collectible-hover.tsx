import { Box, Text } from '@stacks/ui';

export function CollectibleHover(props: { hoverText?: string }) {
  const { hoverText } = props;

  return (
    <Box
      _hover={{ opacity: '1' }}
      alignItems="center"
      background="linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(12, 12, 13, 0) 100%);"
      borderRadius="16px"
      display="flex"
      height="100%"
      justifyContent="center"
      left="0px"
      opacity="0"
      overflow="hidden"
      position="absolute"
      top="0px"
      width="100%"
      zIndex={999}
    >
      {hoverText ? (
        <Text bottom="0px" color="white" left="0px" lineHeight="1.5" p="base" position="absolute">
          {hoverText}
        </Text>
      ) : null}
    </Box>
  );
}
