import { FiCloudOff as IconCloudOff } from 'react-icons/fi';

import { CheckmarkIcon } from '@components/icons/checkmark-icon';

interface NetworkStatusIndicatorProps {
  isActive: boolean;
  isOnline: boolean;
}

export const NetworkStatusIndicator = ({ isActive, isOnline }: NetworkStatusIndicatorProps) => {
  return !isOnline ? <IconCloudOff /> : isActive ? <CheckmarkIcon /> : null;
};
