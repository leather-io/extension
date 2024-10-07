import React from 'react';

import QRCodeIcon from '@assets/images/fund/qr-code-icon.png';
import { FundPageSelectors } from '@tests/selectors/fund.selectors';

import type { CryptoCurrency } from '@leather.io/models';

import { FundAccountTile } from './fund-account-tile';
import { BitcoinIconComponent, StacksIconComponent } from './icon-components';

interface CryptoDescription {
  title: string;
  IconComponent(): React.JSX.Element;
}

const cryptoDescriptions: Record<CryptoCurrency, CryptoDescription> = {
  STX: {
    title: 'Receive STX from a friend or deposit from a separate wallet',
    IconComponent: StacksIconComponent,
  },
  BTC: {
    title: 'Receive BTC from a friend or deposit from a separate wallet',
    IconComponent: BitcoinIconComponent,
  },
};
interface ReceiveStxItemProps {
  onReceive(): void;
  symbol: CryptoCurrency;
}
export function ReceiveFundsItem({ onReceive, symbol }: ReceiveStxItemProps) {
  return (
    <FundAccountTile
      description={cryptoDescriptions[symbol].title}
      icon={QRCodeIcon}
      onClickTile={onReceive}
      ReceiveIcon={cryptoDescriptions[symbol].IconComponent}
      testId={FundPageSelectors.BtnReceiveStx}
    />
  );
}
