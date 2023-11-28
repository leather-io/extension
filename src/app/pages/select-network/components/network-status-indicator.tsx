import { CheckmarkIcon } from '@app/ui/components/icons/checkmark-icon';
import { CloudOffIcon } from '@app/ui/components/icons/cloud-off-icon';

interface NetworkStatusIndicatorProps {
  isActive: boolean;
  isOnline: boolean;
}
export function NetworkStatusIndicator({ isActive, isOnline }: NetworkStatusIndicatorProps) {
  return !isOnline ? <CloudOffIcon /> : isActive ? <CheckmarkIcon /> : null;
}
