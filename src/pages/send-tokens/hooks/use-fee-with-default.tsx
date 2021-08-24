import { useCurrentFee } from '@store/common/common.hooks';

export function useFeeWithDefault() {
  const fee = useCurrentFee();
  return fee ?? 1;
}
