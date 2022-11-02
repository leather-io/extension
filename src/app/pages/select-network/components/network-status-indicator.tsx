import { FiCloudOff as IconCloudOff } from 'react-icons/fi';

import { CheckmarkIcon } from '@app/components/icons/checkmark-icon';

interface NetworkStatusIndicatorProps {
  isActive: boolean;
  isOnline: boolean;
}
export function NetworkStatusIndicator({ isActive, isOnline }: NetworkStatusIndicatorProps) {
  return !isOnline ? <IconCloudOff /> : isActive ? <CheckmarkIcon /> : null;
}
