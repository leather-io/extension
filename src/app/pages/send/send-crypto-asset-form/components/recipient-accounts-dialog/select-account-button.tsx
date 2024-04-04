import type { ComponentProps } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { styled } from 'leather-styles/jsx';

interface SelectAccountButtonProps extends ComponentProps<typeof styled.button> {
  onClick(): void;
}
export function SelectAccountButton({ onClick, ...props }: SelectAccountButtonProps) {
  function preventFocusOfUnderlyingInput(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <styled.button
      type="button"
      color="ink.text-primary"
      userSelect="none"
      textStyle="label.03"
      _hover={{ color: 'ink.action-primary-hover' }}
      data-testid={SendCryptoAssetSelectors.RecipientChooseAccountButton}
      onMouseDown={e => preventFocusOfUnderlyingInput(e)}
      onClick={e => {
        // Improves UX of selecting a recipient from the window. As the button
        // to open the drawer is inside the input, we force focus the button,
        // such that the focus is taken away from the input in background
        (e.target as HTMLButtonElement).focus();
        onClick?.();
      }}
      zIndex={9}
      {...props}
    >
      Select account
    </styled.button>
  );
}
