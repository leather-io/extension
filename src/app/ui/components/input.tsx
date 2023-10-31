import { HTMLStyledProps, styled } from 'leather-styles/jsx';

type InputProps = HTMLStyledProps<'input'>;

export function Input(props: InputProps) {
  return (
    <styled.input
      _focus={{ border: 'focus' }}
      border="default"
      borderRadius="sm"
      minHeight="64px"
      p="space.04"
      ring="none"
      textStyle="body.02"
      width="100%"
      {...props}
    />
  );
}
