import { useEffect, useRef } from 'react';

import isEqual from 'lodash.isequal';

import { logger } from '@shared/logger';
import { InternalMethods } from '@shared/message-types';
import { sendMessage } from '@shared/messages';

import { useMonitorableAddresses } from '@app/features/address-monitor/use-monitorable-addresses';
import type { MonitoredAddress } from '@background/monitors/address-monitor';

// ts-unused-exports:disable-next-line
export function useSyncAddressMonitor() {
  const addresses = useMonitorableAddresses();
  const prevAddresses = useRef<MonitoredAddress[]>([]);

  useEffect(() => {
    if (addresses && !isEqual(addresses, prevAddresses.current)) {
      prevAddresses.current = addresses;

      logger.debug('Syncing Monitored Addresses: ', addresses);
      sendMessage({
        method: InternalMethods.AddressMonitorUpdated,
        payload: {
          addresses,
        },
      });
    }
  }, [addresses]);
}
