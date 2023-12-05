import { styled } from 'leather-styles/jsx';

import { LogomarkIcon } from '@app/ui/icons/logomark-icon';

interface LogoProps {
  onClick?(): void;
}
export function Logo({ onClick }: LogoProps) {
  return (
    <styled.button
      _hover={onClick && { color: 'ink.action-primary-hover' }}
      color="ink.text-primary"
      cursor={onClick ? 'pointer' : 'unset'}
      onClick={onClick ? onClick : undefined}
      height="headerContainerHeight"
    >
      <LogomarkIcon width="logoWidth" height="logoHeight" />
    </styled.button>
  );
}
