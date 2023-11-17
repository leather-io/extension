import { useMemo } from 'react';
import { useAsync } from 'react-async-hook';
import toast from 'react-hot-toast';

import {
  clearBrowserStorageLogs,
  copyLogsToClipboard,
  getLogSizeInBytes,
} from '@shared/logger-storage';
import { isNumber } from '@shared/utils';

import { Divider } from '@app/components/layout/divider';
import { Caption } from '@app/ui/components/typography/caption';

import { SettingsMenuItem as MenuItem } from './settings-menu-item';

const isAnEmptyLogsArrayByteThreshold = 7;

function isSmallEnoughToBeConsiderdEmptyCache(logSizeInBytes?: number) {
  if (!isNumber(logSizeInBytes)) return true;
  return logSizeInBytes < isAnEmptyLogsArrayByteThreshold;
}

interface AdvancedMenuItemsProps {
  closeHandler(fn: () => void): () => void;
  settingsShown: boolean;
}
export function AdvancedMenuItems({ closeHandler, settingsShown }: AdvancedMenuItemsProps) {
  const { result: logSizeInBytes } = useAsync(async () => getLogSizeInBytes(), [settingsShown]);

  const diagnosticLogText = useMemo(() => {
    const noLogInfoMsg = `There are no logs cached`;
    if (!isNumber(logSizeInBytes)) return noLogInfoMsg;
    const logSizeInKiloBytes = logSizeInBytes / 1024;
    return isSmallEnoughToBeConsiderdEmptyCache(logSizeInBytes)
      ? noLogInfoMsg
      : `Delete ${logSizeInKiloBytes.toPrecision(2)}kB of diagnostic logs`;
  }, [logSizeInBytes]);

  return (
    <>
      <MenuItem
        onClick={closeHandler(async () => {
          await copyLogsToClipboard();
          toast.success('Copied to clipboard');
        })}
      >
        Copy diagnostics to clipboard
        <Caption mt="space.04" fontSize="12px !important">
          Contains private wallet usage activity
        </Caption>
      </MenuItem>
      <MenuItem
        onClick={closeHandler(async () => {
          await clearBrowserStorageLogs();
          toast.success('Diagnostic logs cleared');
        })}
      >
        Clear diagnostic information
        <Caption mt="space.04" fontSize="12px !important">
          {diagnosticLogText}
        </Caption>
      </MenuItem>
      <Divider />
    </>
  );
}
