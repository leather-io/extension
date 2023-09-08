// FIXME  - refactor <Caption and then rip out BoxProps
import { BoxProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { Caption } from '@app/components/typography';

interface EditNonceButtonProps extends BoxProps {
  onEditNonce(): void;
}
export function EditNonceButton({ onEditNonce, ...props }: EditNonceButtonProps) {
  return (
    <Caption
      _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
      as="button"
      color={token('colors.brown.12')}
      onClick={onEditNonce}
      type="button"
      {...props}
    >
      Edit nonce
    </Caption>
  );
}
