import { Box, styled } from 'leather-styles/jsx';

export function FormError({ text }: { text: string }) {
  return (
    <Box
      mt="space.02"
      border="1px solid"
      background="red.background-primary"
      borderColor="red.border"
      color="red.action-primary-default"
    >
      <styled.span textStyle="label.03">{text}</styled.span>
    </Box>
  );
}
