import { Button, ButtonProps, color } from '@stacks/ui';

export function SecondaryButton(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <Button
      _hover={{ bg: '#EEF2FB' }}
      bg="#EEF2FB"
      borderRadius="10px"
      color={color('accent')}
      height="48px"
      type="submit"
      {...rest}
    >
      {children}
    </Button>
  );
}
