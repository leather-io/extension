import { useField, useFormikContext } from 'formik';

function useIsFieldDirty(name: string) {
  const [field, meta] = useField(name);
  return field.value !== meta.initialValue;
}

export function useShowFieldError(name: string) {
  const form = useFormikContext();
  const [_, meta] = useField(name);
  const isDirty = useIsFieldDirty(name);

  return (form.submitCount > 0 && meta.error) || (meta.touched && isDirty && meta.error);
}
