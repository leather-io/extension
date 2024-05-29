import { Link } from '@leather-wallet/ui';
import { Stack, styled } from 'leather-styles/jsx';

export function SwapsDisabledTooltipLabel() {
  return (
    <Stack gap="0">
      <styled.span textStyle="caption.01">Swaps temporarily disabled</styled.span>
      <Link
        href="https://leather.io/guides/integrated-swap-disabled"
        target="_blank"
        color="ink.background-primary"
        width="fit-content"
      >
        <styled.span textStyle="caption.01">Learn more</styled.span>
      </Link>
    </Stack>
  );
}
