import { Button, ButtonProps } from '@stacks/ui';
import { useFormikContext } from 'formik';

export function PreviewButton(props: ButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button width="100%" borderRadius="10px" height="48px" onClick={handleSubmit} {...props}>
      Preview
    </Button>
  );
}
