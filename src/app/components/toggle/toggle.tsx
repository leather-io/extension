import { useField } from 'formik';

import { ToggleInput } from './toggle-input';

interface ToggleProps {
  name: string;
}

// ts-unused-exports:disable-next-line
export function Toggle({ name }: ToggleProps) {
  const [field, , helpers] = useField(name);

  return (
    <ToggleInput
      name={name}
      checked={field.value}
      onChange={(checked: boolean) => {
        helpers.setValue(checked);
      }}
    />
  );
}
