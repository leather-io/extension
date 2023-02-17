import { BoxProps, color } from '@stacks/ui';

import { Caption } from '@app/components/typography';

interface EditNonceButtonProps extends BoxProps {
  onEditNonce(): void;
}
export function EditNonceButton({ onEditNonce, ...props }: EditNonceButtonProps) {
  return (
    <Caption
      _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
      as="button"
      color={color('brand')}
      onClick={onEditNonce}
      type="button"
      {...props}
    >
      Edit nonce
    </Caption>
  );
}
