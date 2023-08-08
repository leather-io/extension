import { useNavigate } from 'react-router-dom';

import { ButtonProps } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';

import { RouteUrls } from '@shared/route-urls';

import { useConfigBitcoinEnabled } from '@app/query/common/remote-config/remote-config.query';

import { HomeActionButton } from './HomeActionButton';

function QrCodeIconSvg({ strokeWidth = 1.5, color = 'white' }) {
  return (
    <svg
      color={color}
      height="14px"
      width="14px"
      viewBox="0 0 14 14"
      fill="none"
      strokeWidth={strokeWidth}
    >
      <path
        d="M5.66667 1L1 1L1 5.66667H5.66667V1Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 1L8.33337 1V5.66667H13V1Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33337 8.33301H8.33337V9.33301H9.33337V8.33301Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33337 12H8.33337V13H9.33337V12Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8.33301H12V9.33301H13V8.33301Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 12H12V13H13V12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.66667 8.33301H1L1 12.9997H5.66667V8.33301Z"
        stroke="currentColor"
        strokeWidth={String(strokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReceiveButton() {
  const navigate = useNavigate();
  const isBitcoinEnabled = useConfigBitcoinEnabled();

  return (
    <HomeActionButton
      data-testid={HomePageSelectors.ReceiveCryptoAssetBtn}
      icon={<QrCodeIconSvg />}
      label="Receive"
      onClick={() => navigate(isBitcoinEnabled ? RouteUrls.Receive : RouteUrls.ReceiveStx)}
    />
  );
}
