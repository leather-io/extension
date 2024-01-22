import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { UnsupportedBrowserImg } from '@app/features/ledger/illustrations/ledger-illu-unsupported-browser';
import { Link } from '@app/ui/components/link/link';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

export function UnsupportedBrowserLayout() {
  const navigate = useNavigate();

  return (
    <BaseDrawer isShowing onClose={() => navigate(-1)}>
      <LedgerWrapper image={<UnsupportedBrowserImg />}>
        <LedgerTitle mb="space.03">Your browser isn't supported</LedgerTitle>
        <styled.span textStyle="label.03" color="accent.text-subdued">
          {' '}
          To connect your Ledger with Leather try{' '}
          <Link href="https://www.google.com/chrome/">Chrome</Link> or{' '}
          <Link href="https://brave.com/download/">Brave</Link>.
        </styled.span>
      </LedgerWrapper>
    </BaseDrawer>
  );
}
