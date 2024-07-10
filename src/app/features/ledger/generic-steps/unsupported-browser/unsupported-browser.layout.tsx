import { useNavigate } from 'react-router-dom';

import { styled } from 'leather-styles/jsx';

import { Dialog, Link } from '@leather.io/ui';

import { UnsupportedBrowserImg } from '@app/features/ledger/illustrations/ledger-illu-unsupported-browser';
import { DialogHeader } from '@app/ui/layout/containers/headers/dialog-header';

import { LedgerTitle } from '../../components/ledger-title';
import { LedgerWrapper } from '../../components/ledger-wrapper';

export function UnsupportedBrowserLayout() {
  const navigate = useNavigate();

  return (
    <Dialog header={<DialogHeader />} isShowing onClose={() => navigate(-1)}>
      <LedgerWrapper image={<UnsupportedBrowserImg />}>
        <LedgerTitle mb="space.03">Your browser isn't supported</LedgerTitle>
        <styled.span textStyle="label.03" color="ink.text-subdued">
          {'To connect your Ledger with Leather try '}
          <Link textDecoration="underline" href="https://www.google.com/chrome/">
            Chrome
          </Link>
          {' or '}
          <Link textDecoration="underline" href="https://brave.com/download/">
            Brave
          </Link>
          .
        </styled.span>
      </LedgerWrapper>
    </Dialog>
  );
}
