import { ButtonProps, LeatherButton } from './button/button';

interface EditNonceButtonProps extends ButtonProps {
  onEditNonce(): void;
}
export function EditNonceButton({ onEditNonce, ...props }: EditNonceButtonProps) {
  return (
    <LeatherButton onClick={onEditNonce} textStyle="label.02" variant="link" {...props}>
      Edit nonce
    </LeatherButton>
  );
}
