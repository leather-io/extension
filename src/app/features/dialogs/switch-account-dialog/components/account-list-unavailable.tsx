import { Box, Flex, styled } from 'leather-styles/jsx';

export function AccountListUnavailable() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      minHeight="120px"
      mb="space.06"
      px="space.05"
    >
      <Box>
        <styled.span textStyle="label.01">Unable to load account information</styled.span>
        <styled.span mt="space.03" textStyle="body.02">
          We're unable to load information about your accounts. This may be a problem with the
          wallet's API. If this problem persists, contact support.
        </styled.span>
      </Box>
    </Flex>
  );
}
