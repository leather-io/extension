import { HStack, HstackProps } from 'leather-styles/jsx';

export function SpaceBetween(props: HstackProps) {
  return <HStack alignItems="center" justifyContent="space-between" {...props} />;
}
