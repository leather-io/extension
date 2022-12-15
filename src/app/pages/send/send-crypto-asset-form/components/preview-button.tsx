import { Button, ButtonProps } from '@stacks/ui';

export function PreviewButton(props: ButtonProps) {
  return (
    <Button type="submit" width="100%" borderRadius="10px" height="48px" {...props}>
      Preview
    </Button>
  );
}
