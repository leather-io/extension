import { css } from 'leather-styles/css';
import { VStack, styled } from 'leather-styles/jsx';

export function NoTokensFound() {
  return (
    <VStack h="100%" justifyContent="center">
      <styled.span
        className={css({
          textAlign: 'center',
          padding: '20px',
          color: 'gray',
          fontSize: '18px',
          fontWeight: 'bold',
        })}
      >
        No tokens found
      </styled.span>
    </VStack>
  );
}
