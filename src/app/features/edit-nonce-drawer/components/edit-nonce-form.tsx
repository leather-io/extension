import { Button, Stack } from '@stacks/ui';

import { EditNonceField } from './edit-nonce-field';

interface EditNonceFormProps {
  onBlur(): void;
  onClose(): void;
  onSubmit(): void;
}
export function EditNonceForm(props: EditNonceFormProps): React.JSX.Element {
  const { onBlur, onClose, onSubmit } = props;

  return (
    <>
      <EditNonceField onBlur={onBlur} />
      <Stack isInline>
        <Button flexGrow={1} mode="tertiary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button flexGrow={1} onClick={onSubmit} type="button">
          Apply
        </Button>
      </Stack>
    </>
  );
}
