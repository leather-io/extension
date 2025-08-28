import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';

import { Box, styled } from 'leather-styles/jsx';

import { Caption, DropdownMenu } from '@leather.io/ui';
import { isNumber } from '@leather.io/utils';

import {
  clearBrowserStorageLogs,
  copyLogsToClipboard,
  getLogSizeInBytes,
} from '@shared/logger-storage';

import { Divider } from '@app/components/layout/divider';
import { useToast } from '@app/features/toasts/use-toast';

const isAnEmptyLogsArrayByteThreshold = 7;

function isSmallEnoughToBeConsiderdEmptyCache(logSizeInBytes?: number) {
  if (!isNumber(logSizeInBytes)) return true;
  return logSizeInBytes < isAnEmptyLogsArrayByteThreshold;
}

export function AdvancedMenuItems() {
  const { result: logSizeInBytes } = useAsync(async () => getLogSizeInBytes(), []);
  const toast = useToast();

  const diagnosticLogText = useMemo(() => {
    const noLogInfoMsg = `There are no logs cached`;
    if (!isNumber(logSizeInBytes)) return noLogInfoMsg;
    const logSizeInKiloBytes = logSizeInBytes / 1024;
    return isSmallEnoughToBeConsiderdEmptyCache(logSizeInBytes)
      ? noLogInfoMsg
      : `Delete ${logSizeInKiloBytes.toPrecision(2)}kB of diagnostic logs`;
  }, [logSizeInBytes]);

  return (
    <Box width="100%">
      <DropdownMenu.Item
        style={{ display: 'block' }}
        onClick={async () => {
          await copyLogsToClipboard();
          toast.success('Copied to clipboard');
        }}
      >
        <styled.p>Copy diagnostics to clipboard</styled.p>
        <Caption mt="space.04" fontSize="12px !important">
          Contains private wallet usage activity
        </Caption>
      </DropdownMenu.Item>
      <DropdownMenu.Item
        style={{ display: 'block' }}
        onClick={async () => {
          await clearBrowserStorageLogs();
          toast.success('Diagnostic logs cleared');
        }}
      >
        <styled.p>Clear diagnostic information</styled.p>
        <Caption mt="space.04" fontSize="12px !important">
          {diagnosticLogText}
        </Caption>
      </DropdownMenu.Item>
      <Divider />
    </Box>
  );
}
