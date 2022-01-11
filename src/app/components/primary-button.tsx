import { Button, ButtonProps } from '@stacks/ui';

interface PrimaryButtonProps extends ButtonProps {
  dataTestId?: string;
  onClick?(): void;
}
export function PrimaryButton(props: PrimaryButtonProps) {
  const { children, dataTestId, onClick, ...rest } = props;
  return (
    <Button
      data-testId={dataTestId}
      borderRadius="10px"
      height="48px"
      onClick={onClick}
      type="submit"
      {...rest}
    >
      {children}
    </Button>
  );
}
