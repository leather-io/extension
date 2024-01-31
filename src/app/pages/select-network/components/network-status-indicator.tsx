import { CheckmarkIcon } from '@app/ui/icons/checkmark-icon';
import { CloudOffIcon } from '@app/ui/icons/cloud-off-icon';

interface NetworkStatusIndicatorProps {
  isActive: boolean;
  isOnline: boolean;
}
export function NetworkStatusIndicator({ isActive, isOnline }: NetworkStatusIndicatorProps) {
  return !isOnline ? <CloudOffIcon /> : isActive ? <CheckmarkIcon /> : null;
}
