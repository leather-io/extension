import { Button, Stack } from '@stacks/ui';

import { PrimaryButton } from '@app/components/primary-button';

import { EditNonceField } from './edit-nonce-field';

interface EditNonceFormProps {
  onBlur(): void;
  onClose(): void;
  onSubmit(): void;
}
export function EditNonceForm(props: EditNonceFormProps): JSX.Element {
  const { onBlur, onClose, onSubmit } = props;

  return (
    <>
      <EditNonceField onBlur={onBlur} />
      <Stack isInline>
        <Button flexGrow={1} mode="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <PrimaryButton flexGrow={1} onClick={onSubmit}>
          Apply
        </PrimaryButton>
      </Stack>
    </>
  );
}
