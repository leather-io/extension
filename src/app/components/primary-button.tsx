import { Button, ButtonProps } from '@stacks/ui';

export function PrimaryButton(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <Button borderRadius="10px" height="48px" type="submit" {...rest}>
      {children}
    </Button>
  );
}
