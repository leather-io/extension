import type pino from 'pino';

type LogItem = [ts: string, level: string, message: string, ...other: any];

const maxLogLength = 2_000;

const logStorageKey = 'logs';

function getStorageAdapter() {
  return chrome.storage.local;
}

function truncateLogToMaxSize(logs: LogItem[]) {
  if (logs.length <= maxLogLength) return logs;
  return logs.slice(0, maxLogLength);
}

export async function getLogSizeInBytes(): Promise<number> {
  return new Promise(resolve =>
    getStorageAdapter().getBytesInUse([logStorageKey], bytes => resolve(bytes))
  );
}

export async function clearBrowserStorageLogs(): Promise<void> {
  return new Promise(resolve => getStorageAdapter().set({ [logStorageKey]: [] }, () => resolve()));
}

export async function getLogsFromBrowserStorage(): Promise<LogItem[]> {
  return new Promise(resolve =>
    getStorageAdapter().get([logStorageKey], ({ logs }) => resolve(Array.isArray(logs) ? logs : []))
  );
}

export async function copyLogsToClipboard(): Promise<void> {
  const logs = await getLogsFromBrowserStorage();
  await navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
}

export async function appendLogToBrowserStorage(logEvent: pino.LogEvent): Promise<LogItem> {
  const logs = await getLogsFromBrowserStorage();
  const { ts, level, messages } = logEvent;
  const formattedLogItem = [new Date(ts).toISOString(), level.label, ...messages] as LogItem;
  return new Promise(resolve =>
    getStorageAdapter().set(
      { [logStorageKey]: truncateLogToMaxSize([formattedLogItem, ...logs]) },
      () => resolve(formattedLogItem)
    )
  );
}
