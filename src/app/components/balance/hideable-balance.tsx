import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { useHideBalanceContext } from '@app/common/hide-balance-provider';

interface HideableBalanceProps extends HTMLStyledProps<'span'> {
  children: React.ReactNode;
  forceHidden?: boolean;
}
export function HideableBalance({ forceHidden, children, ...rest }: HideableBalanceProps) {
  const hideBalance = useHideBalanceContext();

  return <styled.span {...rest}>{hideBalance || forceHidden ? '•••••' : children}</styled.span>;
}
