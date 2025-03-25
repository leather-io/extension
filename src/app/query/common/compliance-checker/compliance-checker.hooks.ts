import { compliantErrorBody } from '@leather.io/query';
import { ensureArray } from '@leather.io/utils';

import { useCheckAddressComplianceQueries } from './compliance-checker.query';

interface UseBreakOnNonCompliantEntityProps {
  address: string | string[];
  nativeSegwitSignerAddress: string;
  callback(): void;
}

interface UseBreakOnNonCompliantEntityResult {
  isCompliant: boolean;
}

// TODO LEA-2189  - refactor extension to use this hook
export function useBreakOnNonCompliantEntity({
  address,
  nativeSegwitSignerAddress,
  callback,
}: UseBreakOnNonCompliantEntityProps): UseBreakOnNonCompliantEntityResult {
  const complianceReports = useCheckAddressComplianceQueries([
    nativeSegwitSignerAddress ?? '',
    ...ensureArray(address),
  ]);

  if (complianceReports.some(report => report.data?.isOnSanctionsList)) {
    callback();
    throw new Error(compliantErrorBody);
  }

  return { isCompliant: true };
}
