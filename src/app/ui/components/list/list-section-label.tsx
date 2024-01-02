import { styled } from 'leather-styles/jsx';

export function ListSectionLabel(props: { label: string }) {
  return (
    <styled.span
      color="accent.text-subdued"
      display="block"
      px="space.03"
      py="space.02"
      textStyle="body.02"
      width="100%"
    >
      {props.label}
    </styled.span>
  );
}
