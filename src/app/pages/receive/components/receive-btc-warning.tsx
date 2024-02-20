import { Flex, styled } from 'leather-styles/jsx';

export function ReceiveBtcModalWarning({ message }: { message: string }) {
  return (
    <Flex
      justifyContent="center"
      bg="yellow.background-primary"
      minHeight="48px"
      p="space.05"
      width="100%"
    >
      <styled.span textStyle="label.02">{message}</styled.span>
    </Flex>
  );
}
