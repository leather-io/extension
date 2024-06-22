import { css } from 'leather-styles/css';
import { Stack, styled } from 'leather-styles/jsx';

export function NoTokensFound() {
  return (
    <Stack h="100%" justify="center" align="center">
      <styled.span
        className={css({
          color: 'ink.text-subdued',
          textStyle: 'heading.05',
        })}
      >
        No tokens found
      </styled.span>
    </Stack>
  );
}
