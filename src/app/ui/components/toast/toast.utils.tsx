import { CheckmarkCircleIcon, ErrorIcon, InfoCircleIcon } from '@leather-wallet/ui';

import type { ToastVariant } from './toast';

export function getIconVariant(variant?: ToastVariant) {
  switch (variant) {
    case 'info':
      return <InfoCircleIcon color="ink.ink.background-primary" />;
    case 'success':
      return <CheckmarkCircleIcon color="green.action-primary-default" />;
    case 'error':
      return <ErrorIcon color="red.action-primary-default" />;
    default:
      return <InfoCircleIcon color="ink.ink.background-primary" />;
  }
}
