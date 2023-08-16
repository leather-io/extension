import { HStack } from 'leaf-styles/jsx';

import { LeatherButton } from '@app/components/button/button';

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
        <LeatherButton flexGrow={1} variant="outline" onClick={onClose}>
          Cancel
        </LeatherButton>
        <LeatherButton flexGrow={1} onClick={onSubmit}>
          Apply
        </LeatherButton>
      </HStack>
    </>
  );
}
