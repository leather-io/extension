import { HStack } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

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
      <HStack gap="space.04">
        <Button flexGrow={1} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button flexGrow={1} onClick={onSubmit}>
          Apply
        </Button>
      </HStack>
    </>
  );
}
