import { useEffect, useRef } from 'react';

import isEqual from 'lodash.isequal';

import { InternalMethods } from '@shared/message-types';
import { sendMessage } from '@shared/messages';

import { useMonitorableAddresses } from '@app/features/address-monitor/use-monitorable-addresses';
import { useIsNotificationsEnabled } from '@app/store/settings/settings.selectors';
import type { MonitoredAddress } from '@background/monitors/address-monitor';

export function useSyncAddressMonitor() {
  const isNotificationsEnabled = useIsNotificationsEnabled();
  const addresses = useMonitorableAddresses();
  const prevAddresses = useRef<MonitoredAddress[]>([]);

  useEffect(() => {
    const monitorableAddresses = isNotificationsEnabled ? addresses : [];
    if (monitorableAddresses && !isEqual(monitorableAddresses, prevAddresses.current)) {
      prevAddresses.current = monitorableAddresses;
      sendMessage({
        method: InternalMethods.AddressMonitorUpdated,
        payload: {
          addresses: monitorableAddresses,
        },
      });
    }
  }, [addresses, isNotificationsEnabled]);
}
